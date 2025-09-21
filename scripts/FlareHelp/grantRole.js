// scripts/grantRole.js
// Grants minter role to the donation pool

const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Granting minter role...");
    console.log("Deployer:", deployer.address);
    
    // Contract addresses from the last deployment
    const BADGE_NFT_ADDRESS = "0x3C58E50b6A5C74A816B47BA739C914D743E6A78a";
    const POOL_ADDRESS = "0x7845fF302E85389E88c12F24D9cF479A56e3Dab0";
    
    // Get the BadgeNFT contract
    const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
    const badgeNft = BadgeNFT.attach(BADGE_NFT_ADDRESS);
    
    // Grant minter role
    const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    const tx = await badgeNft.grantRole(MINTER_ROLE, POOL_ADDRESS);
    console.log("Transaction hash:", tx.hash);
    
    await tx.wait();
    console.log("✓ Successfully granted minter role to CrossChainDonationPool");
    
    // Verify the role was granted
    const hasRole = await badgeNft.hasRole(MINTER_ROLE, POOL_ADDRESS);
    console.log("Role granted:", hasRole);
}

main().catch(console.error);
