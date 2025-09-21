const { ethers } = require("hardhat");

async function testRealData() {
  try {
    console.log("🧪 Testing real data integration...\n");

    // Get the deployed contract addresses
    const donationPoolAddress = "0x7845fF302E85389E88c12F24D9cF479A56e3Dab0";
    const badgeNftAddress = "0x3C58E50b6A5C74A816B47BA739C914D743E6A78a";
    const recurringManagerAddress = "0x09Af2320c08537D44efCBFe55ad67C280F63F36E";

    // Connect to the contracts
    const donationPool = await ethers.getContractAt("DonationPool", donationPoolAddress);
    const badgeNft = await ethers.getContractAt("BadgeNFT", badgeNftAddress);
    const recurringManager = await ethers.getContractAt("RecurringDonationManager", recurringManagerAddress);

    console.log("✅ Contracts connected successfully!\n");

    // Test making a small donation
    console.log("💰 Testing donation...");
    const [deployer] = await ethers.getSigners();
    const donationAmount = ethers.parseEther("0.001"); // 0.001 FLR test donation
    
    const tx = await donationPool.donate({ value: donationAmount });
    console.log(`   Transaction hash: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`   Transaction confirmed in block: ${receipt.blockNumber}`);
    
    // Check updated pool balance
    const newPoolBalance = await donationPool.totalPool();
    console.log(`   New pool balance: ${ethers.formatEther(newPoolBalance)} FLR\n`);

    // Test creating an emergency request
    console.log("🏥 Testing emergency request creation...");
    const requestTx = await donationPool.createRequest(
      "TEST-001",
      ethers.parseEther("0.0005"), // 0.0005 FLR request
      "rTestHospital123456789"
    );
    console.log(`   Request transaction hash: ${requestTx.hash}`);
    
    const requestReceipt = await requestTx.wait();
    console.log(`   Request confirmed in block: ${requestReceipt.blockNumber}`);
    
    // Get the request details
    const requestId = (await donationPool.nextRequestId()) - 1n;
    console.log(`   Request ID: ${requestId}`);
    
    try {
      const request = await donationPool.getRequest(requestId);
      console.log(`   Invoice ID: ${request.invoiceId}`);
      console.log(`   Amount: ${ethers.formatEther(request.amountWei)} FLR`);
      console.log(`   Hospital XRPL: ${request.hospitalXrpl}`);
      console.log(`   Funded: ${request.funded}`);
      console.log(`   Paid Out: ${request.paidOut}\n`);
    } catch (error) {
      console.log(`   Error fetching request details: ${error.message}\n`);
    }

    // Test subscription creation
    console.log("📅 Testing subscription creation...");
    const subscriptionTx = await recurringManager.createSubscription(
      ethers.parseEther("0.001"), // 0.001 FLR monthly
      30, // 30 days interval
      false, // Not XRPL
      "" // No XRPL address
    );
    console.log(`   Subscription transaction hash: ${subscriptionTx.hash}`);
    
    const subscriptionReceipt = await subscriptionTx.wait();
    console.log(`   Subscription confirmed in block: ${subscriptionReceipt.blockNumber}\n`);

    // Get final stats
    console.log("📊 Final Statistics:");
    const finalPoolBalance = await donationPool.totalPool();
    const activeSubscriptions = await recurringManager.totalActiveSubscriptions();
    const recurringVolume = await recurringManager.totalRecurringVolume();
    const nextRequestId = await donationPool.nextRequestId();
    
    console.log(`   Pool Balance: ${ethers.formatEther(finalPoolBalance)} FLR`);
    console.log(`   Active Subscriptions: ${activeSubscriptions}`);
    console.log(`   Monthly Recurring Volume: ${ethers.formatEther(recurringVolume)} FLR`);
    console.log(`   Total Requests: ${nextRequestId}`);
    
    console.log("\n🎉 Real data integration test completed successfully!");
    console.log("\n📋 Contract Addresses for Frontend:");
    console.log(`   Donation Pool: ${donationPoolAddress}`);
    console.log(`   Badge NFT: ${badgeNftAddress}`);
    console.log(`   Recurring Manager: ${recurringManagerAddress}`);

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testRealData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

module.exports = { testRealData };
