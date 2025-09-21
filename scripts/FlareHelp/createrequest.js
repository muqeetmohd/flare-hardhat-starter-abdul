// scripts/createRequest.js
require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [creator] = await hre.ethers.getSigners(); // use hospital signer or owner
  const contract = await hre.ethers.getContractAt("DonationPool", process.env.CONTRACT_ADDRESS, creator);
  const amountWei = hre.ethers.parseEther(process.env.DEMO_REQUEST_AMOUNT || "0.02");
  const tx = await contract.createRequest("INV-001", amountWei, process.env.DEMO_HOSPITAL_XRPL);
  await tx.wait();
  console.log("createRequest tx:", tx.hash);
}
main().catch(console.error);
