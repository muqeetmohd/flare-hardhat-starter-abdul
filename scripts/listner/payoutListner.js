// listener/payoutListener.js
require("dotenv").config();
const { ethers } = require("ethers");
const xrpl = require("xrpl");
const fs = require("fs");

const COSTON_RPC = process.env.COSTON2_RPC || "https://coston2-api.flare.network/ext/C/rpc";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const BADGE_ADDRESS = process.env.BADGE_ADDRESS;

const donationAbi = [
  "event DonationMade(address indexed donor, uint256 amountWei, uint256 time)",
  "event RequestFunded(uint256 indexed requestId, uint256 amountWei, string hospitalXrpl)"
];

async function main() {
  if (!process.env.XRPL_SEED) {
    console.error("Set XRPL_SEED in .env");
    process.exit(1);
  }
  const provider = new ethers.JsonRpcProvider(COSTON_RPC);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, donationAbi, provider);

  // XRPL client
  const xrplClient = new xrpl.Client(process.env.XRPL_SERVER || "wss://s.altnet.rippletest.net:51233");
  await xrplClient.connect();
  const xrplWallet = xrpl.Wallet.fromSeed(process.env.XRPL_SEED);
  console.log("XRPL wallet:", xrplWallet.classicAddress);

  // Badge contract (we will call it to mint badges)
  const badgeAbi = [
    "function mintBadge(address to, string metadataURI) external returns (uint256)"
  ];
  // For minting we need a signer (private key owner of BadgeNFT contract). Use Hardhat deployer/private key configured in .env
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const badgeContract = new ethers.Contract(BADGE_ADDRESS, badgeAbi, signer);

  // Listen for RequestFunded (this event is emitted when a request is funded)
  contract.on("RequestFunded", async (requestId, amountWei, hospitalXrpl) => {
    try {
      console.log("[Event] RequestFunded", requestId.toString(), amountWei.toString(), hospitalXrpl);
      // 1) reconstruct donors and contributions by scanning past DonationMade events
      const filter = contract.filters.DonationMade();
      const logs = await provider.getLogs({ fromBlock: 0, toBlock: "latest", address: CONTRACT_ADDRESS, topics: filter.topics });
      // decode logs
      const iface = new ethers.Interface(donationAbi);
      const contributions = {}; // address => BigInt
      let total = BigInt(0);
      for (const l of logs) {
        const parsed = iface.parseLog(l);
        const donor = parsed.args.donor;
        const amt = BigInt(parsed.args.amountWei.toString());
        if (!contributions[donor]) contributions[donor] = BigInt(0);
        contributions[donor] += amt;
        total += amt;
      }
      console.log("Total pool (reconstructed):", total.toString());

      // 2) Compute shares and mint badges to donors (off-chain compute)
      // Convert amountWei BigInt to string for convenience
      const fundedAmount = BigInt(amountWei.toString());

      // For demo: mint a badge for each donor who had >0 contribution (you can refine)
      for (const donorAddr of Object.keys(contributions)) {
        // compute share = contributions[donor] / total * fundedAmount
        const share = (contributions[donorAddr] * fundedAmount) / (total || BigInt(1));
        // optionally build metadata URI describing impact
        const metadata = `{"requestId":${requestId.toString()},"helpValueWei":"${share.toString()}"}`;
        // send on-chain tx to mint badge (badgeContract is connected with signer)
        try {
          const tx = await badgeContract.mintBadge(donorAddr, metadata);
          await tx.wait();
          console.log(`Minted badge to ${donorAddr}`);
        } catch (e) {
          console.error("Badge mint failed:", e);
        }
      }

      // 3) XRPL payout to hospital (demo uses fixed conversion or ENV override)
      const payoutXrp = process.env.XRPL_PAYOUT_AMOUNT_XRP || "1"; // for demo
      const drops = xrpl.xrpToDrops(payoutXrp);
      const payment = {
        TransactionType: "Payment",
        Account: xrplWallet.classicAddress,
        Destination: hospitalXrpl,
        Amount: drops
      };
      const prepared = await xrplClient.autofill(payment);
      const signed = xrplWallet.sign(prepared);
      const submit = await xrplClient.submitAndWait(signed.tx_blob);
      console.log("XRPL submit:", submit.result.meta.TransactionResult);
    } catch (err) {
      console.error("Error processing RequestFunded:", err);
    }
  });

  console.log("Listener running — waiting for RequestFunded events...");
}

main().catch(console.error);
