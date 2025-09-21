// scripts/impactTracker.js
// Tracks and displays donor impact across the FlareHelp system

const { ethers } = require("hardhat");

class FlareHelpImpactTracker {
    constructor(donationPoolAddress, recurringManagerAddress, badgeNftAddress) {
        this.donationPoolAddress = donationPoolAddress;
        this.recurringManagerAddress = recurringManagerAddress;
        this.badgeNftAddress = badgeNftAddress;
    }
    
    async initialize() {
        this.donationPool = await ethers.getContractAt("CrossChainDonationPool", this.donationPoolAddress);
        this.recurringManager = await ethers.getContractAt("RecurringDonationManager", this.recurringManagerAddress);
        this.badgeNft = await ethers.getContractAt("BadgeNFT", this.badgeNftAddress);
    }
    
    // Get comprehensive impact data for a donor
    async getDonorImpact(donorAddress) {
        console.log(`\n=== Impact Report for ${donorAddress} ===`);
        
        // Get donation pool impact
        const poolImpact = await this.donationPool.getDonorImpact(donorAddress);
        
        // Get recurring donation stats
        const recurringStats = await this.recurringManager.getDonorStats(donorAddress);
        
        // Get badge count
        const badgeBalance = await this.badgeNft.balanceOf(donorAddress);
        
        // Calculate total impact
        const totalFlareContributions = poolImpact.flareContributions;
        const totalXrplContributions = poolImpact.xrplContributions;
        const totalRecurringContributions = recurringStats.totalContributed;
        const totalRequestsHelped = poolImpact.requestsHelped;
        const totalPayments = recurringStats.paymentCount;
        
        console.log("💰 Financial Impact:");
        console.log(`  Flare Contributions: ${ethers.utils.formatEther(totalFlareContributions)} ETH`);
        console.log(`  XRPL Contributions: ${ethers.utils.formatEther(totalXrplContributions)} ETH equivalent`);
        console.log(`  Recurring Contributions: ${ethers.utils.formatEther(totalRecurringContributions)} ETH`);
        console.log(`  Total Contributions: ${ethers.utils.formatEther(totalFlareContributions.add(totalXrplContributions).add(totalRecurringContributions))} ETH`);
        
        console.log("\n🏥 Humanitarian Impact:");
        console.log(`  Emergency Requests Helped: ${totalRequestsHelped}`);
        console.log(`  Recurring Payments Made: ${totalPayments}`);
        
        console.log("\n🏆 Recognition:");
        console.log(`  Badges Earned: ${badgeBalance}`);
        
        console.log("\n📊 Subscription Status:");
        console.log(`  Has Active Subscription: ${recurringStats.hasActiveSubscription}`);
        if (recurringStats.hasActiveSubscription) {
            const nextPayment = new Date(recurringStats.nextPaymentDue * 1000);
            console.log(`  Next Payment Due: ${nextPayment.toLocaleDateString()}`);
        }
        
        return {
            totalContributions: totalFlareContributions.add(totalXrplContributions).add(totalRecurringContributions),
            requestsHelped: totalRequestsHelped,
            badgesEarned: badgeBalance,
            hasActiveSubscription: recurringStats.hasActiveSubscription,
            nextPaymentDue: recurringStats.nextPaymentDue
        };
    }
    
    // Get system-wide statistics
    async getSystemStats() {
        console.log("\n=== FlareHelp System Statistics ===");
        
        // Get pool statistics
        const totalPool = await this.donationPool.totalPool();
        const totalXrplDonations = await this.donationPool.totalXrplDonations();
        const nextRequestId = await this.donationPool.nextRequestId();
        
        // Get recurring statistics
        const totalActiveSubscriptions = await this.recurringManager.totalActiveSubscriptions();
        const totalRecurringVolume = await this.recurringManager.totalRecurringVolume();
        
        console.log("💵 Pool Status:");
        console.log(`  Total Pool (Flare): ${ethers.utils.formatEther(totalPool)} ETH`);
        console.log(`  Total XRPL Donations: ${ethers.utils.formatEther(totalXrplDonations)} ETH equivalent`);
        
        console.log("\n🔄 Recurring Donations:");
        console.log(`  Active Subscriptions: ${totalActiveSubscriptions}`);
        console.log(`  Monthly Recurring Volume: ${ethers.utils.formatEther(totalRecurringVolume)} ETH`);
        
        console.log("\n🏥 Emergency Requests:");
        console.log(`  Total Requests Created: ${nextRequestId}`);
        
        // Calculate estimated monthly impact
        const monthlyImpact = totalRecurringVolume.add(totalPool.div(12)); // Rough estimate
        console.log(`\n📈 Estimated Monthly Impact: ${ethers.utils.formatEther(monthlyImpact)} ETH`);
        
        return {
            totalPool: totalPool,
            totalXrplDonations: totalXrplDonations,
            totalRequests: nextRequestId,
            activeSubscriptions: totalActiveSubscriptions,
            monthlyVolume: totalRecurringVolume
        };
    }
    
    // Get recent emergency requests
    async getRecentRequests(limit = 5) {
        console.log(`\n=== Recent Emergency Requests (Last ${limit}) ===`);
        
        const nextRequestId = await this.donationPool.nextRequestId();
        const startId = nextRequestId > limit ? nextRequestId - limit : 0;
        
        for (let i = startId; i < nextRequestId; i++) {
            const request = await this.donationPool.requests(i);
            const status = request.funded ? (request.paidOut ? "✅ Paid Out" : "💰 Funded") : "⏳ Pending";
            
            console.log(`\nRequest #${i}:`);
            console.log(`  Invoice ID: ${request.invoiceId}`);
            console.log(`  Amount: ${ethers.utils.formatEther(request.amountWei)} ETH`);
            console.log(`  Hospital XRPL: ${request.hospitalXrpl}`);
            console.log(`  Status: ${status}`);
            console.log(`  Contributors: ${request.contributors.length}`);
        }
    }
    
    // Display XRPL payment instructions
    async displayXrplInstructions() {
        console.log("\n=== XRPL Payment Instructions ===");
        
        const paymentDetails = await this.donationPool.getXrplPaymentDetails();
        
        console.log("To donate via XRPL:");
        console.log(`1. Send XRP to: ${paymentDetails.receiver}`);
        console.log(`2. Use Destination Tag: ${paymentDetails.destinationTag}`);
        console.log(`3. Minimum Amount: ${Number(paymentDetails.minAmount) / 1000000} XRP`);
        console.log("4. Your donation will be automatically processed and you'll receive a badge!");
    }
}

// Example usage
async function main() {
    // Replace with actual contract addresses after deployment
    const DONATION_POOL_ADDRESS = "0x...";
    const RECURRING_MANAGER_ADDRESS = "0x...";
    const BADGE_NFT_ADDRESS = "0x...";
    
    const tracker = new FlareHelpImpactTracker(
        DONATION_POOL_ADDRESS,
        RECURRING_MANAGER_ADDRESS,
        BADGE_NFT_ADDRESS
    );
    
    await tracker.initialize();
    
    // Get system stats
    await tracker.getSystemStats();
    
    // Get recent requests
    await tracker.getRecentRequests(3);
    
    // Display XRPL instructions
    await tracker.displayXrplInstructions();
    
    // Example: Get impact for a specific donor
    // await tracker.getDonorImpact("0x...");
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = FlareHelpImpactTracker;
