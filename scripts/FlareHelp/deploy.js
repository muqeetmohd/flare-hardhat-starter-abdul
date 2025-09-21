// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);
  
    const DonationPool = await ethers.getContractFactory("DonationPool");
    const pool = await DonationPool.deploy();
    await pool.waitForDeployment();
    console.log("DonationPool deployed:", await pool.getAddress());
  
    const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
    const nft = await BadgeNFT.deploy(deployer.address);
    await nft.waitForDeployment();
    console.log("BadgeNFT deployed:", await nft.getAddress());
  }
  main().catch(e => { console.error(e); process.exit(1); });
  