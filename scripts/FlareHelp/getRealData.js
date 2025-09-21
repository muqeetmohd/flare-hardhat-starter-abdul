const { ethers } = require("hardhat");

async function getRealData() {
  try {
    // Get the deployed contract addresses
    const donationPoolAddress = "0x7845fF302E85389E88c12F24D9cF479A56e3Dab0";
    const badgeNftAddress = "0x3C58E50b6A5C74A816B47BA739C914D743E6A78a";
    const recurringManagerAddress = "0x09Af2320c08537D44efCBFe55ad67C280F63F36E";

    // Connect to the contracts
    const donationPool = await ethers.getContractAt("DonationPool", donationPoolAddress);
    const badgeNft = await ethers.getContractAt("BadgeNFT", badgeNftAddress);
    const recurringManager = await ethers.getContractAt("RecurringDonationManager", recurringManagerAddress);

    console.log("🔍 Fetching real data from deployed contracts...\n");

    // Get real pool data
    const totalPool = await donationPool.totalPool();
    const nextRequestId = await donationPool.nextRequestId();
    
    console.log("💰 Pool Data:");
    console.log(`   Total Pool: ${ethers.formatEther(totalPool)} FLR`);
    console.log(`   Next Request ID: ${nextRequestId}`);
    console.log(`   Pool Address: ${donationPoolAddress}\n`);

    // Get real subscription data
    const activeSubscriptions = await recurringManager.totalActiveSubscriptions();
    const recurringVolume = await recurringManager.totalRecurringVolume();
    
    console.log("📊 Subscription Data:");
    console.log(`   Active Subscriptions: ${activeSubscriptions}`);
    console.log(`   Monthly Recurring Volume: ${ethers.formatEther(recurringVolume)} FLR`);
    console.log(`   Recurring Manager: ${recurringManagerAddress}\n`);

    // Get real request data
    console.log("🏥 Emergency Requests:");
    for (let i = 0; i < nextRequestId; i++) {
      try {
        const request = await donationPool.getRequest(i);
        console.log(`   Request ${i}:`);
        console.log(`     Invoice ID: ${request.invoiceId}`);
        console.log(`     Amount: ${ethers.formatEther(request.amountWei)} FLR`);
        console.log(`     Hospital XRPL: ${request.hospitalXrpl}`);
        console.log(`     Funded: ${request.funded}`);
        console.log(`     Paid Out: ${request.paidOut}\n`);
      } catch (error) {
        console.log(`   Request ${i}: Error fetching data\n`);
      }
    }

    // Get real badge data
    console.log("🏆 Badge Contract:");
    console.log(`   Badge NFT Address: ${badgeNftAddress}`);
    
    // Try to get total supply if the function exists
    try {
      const totalSupply = await badgeNft.totalSupply();
      console.log(`   Total Badges Minted: ${totalSupply}`);
    } catch (error) {
      console.log(`   Total Badges: Function not available`);
    }

    console.log("\n✅ Real data fetched successfully!");
    
    return {
      totalPool: ethers.formatEther(totalPool),
      nextRequestId: nextRequestId.toString(),
      activeSubscriptions: activeSubscriptions.toString(),
      recurringVolume: ethers.formatEther(recurringVolume),
      poolAddress: donationPoolAddress,
      badgeAddress: badgeNftAddress,
      recurringAddress: recurringManagerAddress
    };

  } catch (error) {
    console.error("❌ Error fetching real data:", error);
    return null;
  }
}

// Run if called directly
if (require.main === module) {
  getRealData()
    .then((data) => {
      if (data) {
        console.log("\n📋 Summary for Frontend Integration:");
        console.log(JSON.stringify(data, null, 2));
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

module.exports = { getRealData };
