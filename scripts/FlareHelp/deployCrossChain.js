// scripts/deployCrossChain.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);
  
    // Deploy BadgeNFT first
    const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
    const badgeNft = await BadgeNFT.deploy(deployer.address);
    await badgeNft.waitForDeployment();
    console.log("BadgeNFT deployed:", await badgeNft.getAddress());
  
    // Deploy CrossChainDonationPool
    const CrossChainDonationPool = await ethers.getContractFactory("CrossChainDonationPool");
    
    // XRPL receiver address (example - replace with actual XRPL address)
    const xrplReceiver = "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH";
    
    const pool = await CrossChainDonationPool.deploy(
        deployer.address, // initialOwner
        await badgeNft.getAddress(), // badgeNft address
        xrplReceiver // XRPL receiver address
    );
    await pool.waitForDeployment();
    console.log("CrossChainDonationPool deployed:", await pool.getAddress());
    
    // Grant minter role to the pool
    const MINTER_ROLE = await badgeNft.MINTER_ROLE();
    await badgeNft.grantRole(MINTER_ROLE, await pool.getAddress());
    console.log("Granted minter role to CrossChainDonationPool");
    
    // Display XRPL payment details
    const paymentDetails = await pool.getXrplPaymentDetails();
    console.log("\n=== XRPL Payment Details ===");
    console.log("XRPL Receiver Address:", paymentDetails.receiver);
    console.log("Destination Tag:", paymentDetails.destinationTag);
    console.log("Minimum Amount (drops):", paymentDetails.minAmount.toString());
    console.log("Minimum Amount (XRP):", (Number(paymentDetails.minAmount) / 1000000).toString());
    
    console.log("\n=== Deployment Complete ===");
    console.log("BadgeNFT:", await badgeNft.getAddress());
    console.log("CrossChainDonationPool:", await pool.getAddress());
  }
  
  main().catch(e => { console.error(e); process.exit(1); });
