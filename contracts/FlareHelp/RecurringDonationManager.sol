// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CrossChainDonationPool.sol";

contract RecurringDonationManager is Ownable, ReentrancyGuard {
    struct Subscription {
        address donor;
        uint256 amountWei;
        uint256 intervalDays; // Days between payments
        uint256 lastPayment;
        uint256 nextPayment;
        bool active;
        bool isXrpl; // Whether this is an XRPL subscription
        string xrplAddress; // XRPL address for XRPL subscriptions
    }
    
    mapping(address => Subscription) public subscriptions;
    mapping(address => uint256) public donorTotalContributed;
    mapping(address => uint256) public donorPaymentCount;
    
    CrossChainDonationPool public donationPool;
    IERC20 public usdcToken; // For USD-denominated donations
    
    uint256 public totalActiveSubscriptions;
    uint256 public totalRecurringVolume; // Total recurring donations per month
    
    // Events
    event SubscriptionCreated(address indexed donor, uint256 amountWei, uint256 intervalDays, bool isXrpl);
    event SubscriptionUpdated(address indexed donor, uint256 newAmountWei, uint256 newIntervalDays);
    event SubscriptionCancelled(address indexed donor);
    event RecurringPaymentProcessed(address indexed donor, uint256 amountWei, uint256 paymentNumber);
    event BatchPaymentProcessed(uint256 totalDonors, uint256 totalAmount);
    
    constructor(address _donationPool, address _usdcToken) Ownable(msg.sender) {
        donationPool = CrossChainDonationPool(payable(_donationPool));
        usdcToken = IERC20(_usdcToken);
    }
    
    // Create a recurring donation subscription
    function createSubscription(
        uint256 amountWei,
        uint256 intervalDays,
        bool isXrpl,
        string calldata xrplAddress
    ) external {
        require(amountWei > 0, "Amount must be greater than 0");
        require(intervalDays >= 1, "Interval must be at least 1 day");
        require(!subscriptions[msg.sender].active, "Subscription already exists");
        
        if (isXrpl) {
            require(bytes(xrplAddress).length > 0, "XRPL address required for XRPL subscriptions");
        }
        
        subscriptions[msg.sender] = Subscription({
            donor: msg.sender,
            amountWei: amountWei,
            intervalDays: intervalDays,
            lastPayment: 0,
            nextPayment: block.timestamp + (intervalDays * 1 days),
            active: true,
            isXrpl: isXrpl,
            xrplAddress: xrplAddress
        });
        
        totalActiveSubscriptions++;
        totalRecurringVolume += amountWei;
        
        emit SubscriptionCreated(msg.sender, amountWei, intervalDays, isXrpl);
    }
    
    // Update existing subscription
    function updateSubscription(
        uint256 newAmountWei,
        uint256 newIntervalDays
    ) external {
        require(subscriptions[msg.sender].active, "No active subscription");
        require(newAmountWei > 0, "Amount must be greater than 0");
        require(newIntervalDays >= 1, "Interval must be at least 1 day");
        
        Subscription storage sub = subscriptions[msg.sender];
        
        // Update recurring volume
        totalRecurringVolume = totalRecurringVolume - sub.amountWei + newAmountWei;
        
        sub.amountWei = newAmountWei;
        sub.intervalDays = newIntervalDays;
        
        // Recalculate next payment if needed
        if (block.timestamp >= sub.nextPayment) {
            sub.nextPayment = block.timestamp + (newIntervalDays * 1 days);
        }
        
        emit SubscriptionUpdated(msg.sender, newAmountWei, newIntervalDays);
    }
    
    // Cancel subscription
    function cancelSubscription() external {
        require(subscriptions[msg.sender].active, "No active subscription");
        
        Subscription storage sub = subscriptions[msg.sender];
        sub.active = false;
        
        totalActiveSubscriptions--;
        totalRecurringVolume -= sub.amountWei;
        
        emit SubscriptionCancelled(msg.sender);
    }
    
    // Process a single donor's recurring payment
    function processDonorPayment(address donor) external nonReentrant {
        Subscription storage sub = subscriptions[donor];
        require(sub.active, "No active subscription");
        require(block.timestamp >= sub.nextPayment, "Payment not due yet");
        
        if (sub.isXrpl) {
            // For XRPL subscriptions, we can't automatically process
            // This would require off-chain monitoring and manual processing
            revert("XRPL subscriptions require manual processing");
        } else {
            // Process native token payment
            require(msg.sender == donor, "Only donor can process their payment");
            require(address(this).balance >= sub.amountWei, "Insufficient contract balance");
            
            // Transfer to donation pool
            (bool success, ) = address(donationPool).call{value: sub.amountWei}("");
            require(success, "Transfer to donation pool failed");
            
            // Update subscription
            sub.lastPayment = block.timestamp;
            sub.nextPayment = block.timestamp + (sub.intervalDays * 1 days);
            donorTotalContributed[donor] += sub.amountWei;
            donorPaymentCount[donor]++;
            
            emit RecurringPaymentProcessed(donor, sub.amountWei, donorPaymentCount[donor]);
        }
    }
    
    // Process USDC recurring payment
    function processUsdcPayment() external nonReentrant {
        Subscription storage sub = subscriptions[msg.sender];
        require(sub.active, "No active subscription");
        require(!sub.isXrpl, "This is an XRPL subscription");
        require(block.timestamp >= sub.nextPayment, "Payment not due yet");
        
        // Transfer USDC from donor to this contract
        require(usdcToken.transferFrom(msg.sender, address(this), sub.amountWei), "USDC transfer failed");
        
        // Transfer USDC to donation pool (assuming it accepts USDC)
        require(usdcToken.transfer(address(donationPool), sub.amountWei), "USDC transfer to pool failed");
        
        // Update subscription
        sub.lastPayment = block.timestamp;
        sub.nextPayment = block.timestamp + (sub.intervalDays * 1 days);
        donorTotalContributed[msg.sender] += sub.amountWei;
        donorPaymentCount[msg.sender]++;
        
        emit RecurringPaymentProcessed(msg.sender, sub.amountWei, donorPaymentCount[msg.sender]);
    }
    
    // Batch process multiple donors (for gas efficiency)
    function batchProcessPayments(address[] calldata donors) external onlyOwner {
        uint256 totalAmount = 0;
        uint256 processedCount = 0;
        
        for (uint256 i = 0; i < donors.length; i++) {
            address donor = donors[i];
            Subscription storage sub = subscriptions[donor];
            
            if (sub.active && !sub.isXrpl && block.timestamp >= sub.nextPayment) {
                // Process payment
                (bool success, ) = address(donationPool).call{value: sub.amountWei}("");
                if (success) {
                    sub.lastPayment = block.timestamp;
                    sub.nextPayment = block.timestamp + (sub.intervalDays * 1 days);
                    donorTotalContributed[donor] += sub.amountWei;
                    donorPaymentCount[donor]++;
                    totalAmount += sub.amountWei;
                    processedCount++;
                    
                    emit RecurringPaymentProcessed(donor, sub.amountWei, donorPaymentCount[donor]);
                }
            }
        }
        
        emit BatchPaymentProcessed(processedCount, totalAmount);
    }
    
    // Get subscription details for a donor
    function getSubscription(address donor) external view returns (Subscription memory) {
        return subscriptions[donor];
    }
    
    // Get donor statistics
    function getDonorStats(address donor) external view returns (
        uint256 totalContributed,
        uint256 paymentCount,
        bool hasActiveSubscription,
        uint256 nextPaymentDue
    ) {
        totalContributed = donorTotalContributed[donor];
        paymentCount = donorPaymentCount[donor];
        hasActiveSubscription = subscriptions[donor].active;
        nextPaymentDue = subscriptions[donor].nextPayment;
    }
    
    // Get XRPL subscription details for processing
    function getXrplSubscriptions() external view returns (
        address[] memory donors,
        uint256[] memory amounts,
        string[] memory xrplAddresses,
        uint256[] memory nextPayments
    ) {
        // This would need to be implemented to return all XRPL subscriptions
        // For now, return empty arrays
        donors = new address[](0);
        amounts = new uint256[](0);
        xrplAddresses = new string[](0);
        nextPayments = new uint256[](0);
    }
    
    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function emergencyWithdrawUsdc() external onlyOwner {
        usdcToken.transfer(owner(), usdcToken.balanceOf(address(this)));
    }
    
    // Accept native token payments
    receive() external payable {
        // Allow direct donations
    }
}
