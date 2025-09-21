// scripts/deployCompleteSystem.js
// Deploys the complete FlareHelp cross-chain donation system

const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying FlareHelp Cross-Chain Donation System");
    console.log("Deployer:", deployer.address);
    
    // 1. Deploy BadgeNFT
    console.log("\n=== 1. Deploying BadgeNFT ===");
    const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
    const badgeNft = await BadgeNFT.deploy(deployer.address);
    await badgeNft.waitForDeployment();
    const badgeNftAddress = await badgeNft.getAddress();
    console.log("BadgeNFT deployed:", badgeNftAddress);
    
    // 2. Deploy CrossChainDonationPool
    console.log("\n=== 2. Deploying CrossChainDonationPool ===");
    const CrossChainDonationPool = await ethers.getContractFactory("CrossChainDonationPool");
    
    // XRPL receiver address (replace with actual XRPL address)
    const xrplReceiver = "0x0000000000000000000000000000000000000000"; // Placeholder - replace with actual XRPL address
    
    const donationPool = await CrossChainDonationPool.deploy(
        deployer.address, // initialOwner
        badgeNftAddress, // badgeNft address
        xrplReceiver // XRPL receiver address
    );
    await donationPool.waitForDeployment();
    const poolAddress = await donationPool.getAddress();
    console.log("CrossChainDonationPool deployed:", poolAddress);
    
    // 3. Deploy RecurringDonationManager
    console.log("\n=== 3. Deploying RecurringDonationManager ===");
    const RecurringDonationManager = await ethers.getContractFactory("RecurringDonationManager");
    
    // USDC token address (replace with actual USDC address on the network)
    const usdcAddress = "0x0000000000000000000000000000000000000000"; // Placeholder - replace with actual USDC address
    
    const recurringManager = await RecurringDonationManager.deploy(
        poolAddress, // donationPool address
        usdcAddress // USDC token address
    );
    await recurringManager.waitForDeployment();
    const recurringAddress = await recurringManager.getAddress();
    console.log("RecurringDonationManager deployed:", recurringAddress);
    
    // 4. Set up permissions
    console.log("\n=== 4. Setting up permissions ===");
    
    // Grant minter role to the donation pool
    const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"; // keccak256("MINTER_ROLE")
    const tx = await badgeNft.grantRole(MINTER_ROLE, poolAddress);
    await tx.wait();
    console.log("✓ Granted minter role to CrossChainDonationPool");
    
    // 5. Display system information
    console.log("\n=== 5. System Information ===");
    
    // XRPL payment details
    const paymentDetails = await donationPool.getXrplPaymentDetails();
    console.log("\n--- XRPL Payment Details ---");
    console.log("XRPL Receiver Address:", paymentDetails.receiver);
    console.log("Destination Tag:", paymentDetails.destinationTag);
    console.log("Minimum Amount (drops):", paymentDetails.minAmount.toString());
    console.log("Minimum Amount (XRP):", (Number(paymentDetails.minAmount) / 1000000).toString());
    
    // Contract addresses
    console.log("\n--- Contract Addresses ---");
    console.log("BadgeNFT:", badgeNftAddress);
    console.log("CrossChainDonationPool:", poolAddress);
    console.log("RecurringDonationManager:", recurringAddress);
    
    // System capabilities
    console.log("\n--- System Capabilities ---");
    console.log("✓ Native Flare donations");
    console.log("✓ XRPL cross-chain donations");
    console.log("✓ Recurring donation subscriptions");
    console.log("✓ USDC recurring payments");
    console.log("✓ Badge/NFT reward system");
    console.log("✓ Emergency fund disbursement");
    console.log("✓ Donor impact tracking");
    
    // Usage examples
    console.log("\n--- Usage Examples ---");
    console.log("1. Native donation:");
        console.log(`   await donationPool.donate({ value: ethers.parseEther("5") })`);
    
    console.log("\n2. Create recurring subscription:");
    console.log(`   await recurringManager.createSubscription(`);
    console.log(`     ethers.parseEther("5"), // 5 ETH per month`);
    console.log(`     30, // every 30 days`);
    console.log(`     false, // not XRPL`);
    console.log(`     "" // no XRPL address needed`);
    console.log(`   )`);
    
    console.log("\n3. Create XRPL subscription:");
    console.log(`   await recurringManager.createSubscription(`);
    console.log(`     ethers.parseEther("5"), // 5 ETH equivalent`);
    console.log(`     30, // every 30 days`);
    console.log(`     true, // is XRPL`);
    console.log(`     "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH" // XRPL address`);
    console.log(`   )`);
    
    console.log("\n4. Create emergency request:");
    console.log(`   await donationPool.createRequest(`);
    console.log(`     "INV-001", // invoice ID`);
    console.log(`     ethers.parseEther("100"), // amount needed`);
    console.log(`     "rHospitalAddress123" // hospital XRPL address`);
    console.log(`   )`);
    
    console.log("\n=== Deployment Complete! ===");
    console.log("Your FlareHelp cross-chain donation system is ready!");
    console.log("Donors can now contribute via Flare native tokens or XRPL");
    console.log("Hospitals can create emergency requests");
    console.log("The system automatically tracks impact and awards badges");
}

main().catch(e => { 
    console.error("Deployment failed:", e); 
    process.exit(1); 
});
