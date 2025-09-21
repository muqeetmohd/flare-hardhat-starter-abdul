// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IEVMTransaction} from "@flarenetwork/flare-periphery-contracts/coston2/IEVMTransaction.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import "./BadgeNft.sol";

contract CrossChainDonationPool is Ownable, ReentrancyGuard {
    uint256 public nextRequestId;
    uint256 public totalPool; // total wei held in contract
    uint256 public totalXrplDonations; // total XRPL donations received
    uint256 public constant MIN_DONATION_AMOUNT = 1000000; // 1 XRP in drops (minimum XRPL payment)
    
    // XRPL payment tracking
    mapping(bytes32 => bool) public processedXrplTransactions;
    mapping(address => uint256) public donorXrplContributions;
    mapping(address => uint256) public donorFlareContributions;
    
    // XRPL addresses for receiving payments
    address public xrplReceiverAddress;
    string public xrplDestinationTag; // For identifying specific donations
    
    struct Request {
        string invoiceId;
        address creator;
        string hospitalXrpl;
        uint256 amountWei;
        bool funded;
        bool paidOut;
        uint256 fundedAt;
        address[] contributors; // Track who contributed to this specific request
    }

    mapping(uint256 => Request) public requests;
    
    // Cross-chain donation tracking
    struct CrossChainDonation {
        address donor;
        uint256 amountWei;
        uint256 xrplAmount; // Amount in XRPL drops
        uint256 timestamp;
        string xrplTxHash;
        bool processed;
    }
    
    mapping(bytes32 => CrossChainDonation) public crossChainDonations;
    bytes32[] public donationHashes;

    // Events
    event DonationMade(address indexed donor, uint256 amountWei, uint256 time);
    event XrplDonationReceived(address indexed donor, uint256 xrplAmount, string xrplTxHash, uint256 flareAmount);
    event RequestCreated(uint256 indexed requestId, string invoiceId, uint256 amountWei, string hospitalXrpl);
    event RequestFunded(uint256 indexed requestId, uint256 amountWei, string hospitalXrpl, address[] contributors);
    event RequestPaidOut(uint256 indexed requestId, uint256 amountWei, string hospitalXrpl);
    event BadgeAwarded(address indexed donor, uint256 badgeId, uint256 totalContributions);

    BadgeNFT public badgeNft;

    constructor(address initialOwner, address _badgeNft, address _xrplReceiver) Ownable(initialOwner) {
        badgeNft = BadgeNFT(_badgeNft);
        xrplReceiverAddress = _xrplReceiver;
        xrplDestinationTag = "123456"; // Example destination tag
    }

    // Native Flare donations
    function donate() external payable {
        require(msg.value > 0, "Must send value");
        totalPool += msg.value;
        donorFlareContributions[msg.sender] += msg.value;
        emit DonationMade(msg.sender, msg.value, block.timestamp);
    }

    // Process XRPL payments via FDC verification
    function processXrplPayment(
        IEVMTransaction.Proof calldata _transaction,
        string calldata xrplTxHash,
        uint256 xrplAmount
    ) external nonReentrant {
        bytes32 transactionHash = _transaction.data.requestBody.transactionHash;
        require(
            !processedXrplTransactions[transactionHash],
            "Transaction already processed"
        );

        // Verify the XRPL transaction through FDC
        require(
            isXrplTransactionProofValid(_transaction),
            "Invalid XRPL transaction proof"
        );

        // Mark transaction as processed
        processedXrplTransactions[transactionHash] = true;

        // Calculate Flare equivalent (simplified - in production use price feeds)
        uint256 flareAmount = xrplAmount / 1000000; // 1 XRP = 1 wei (simplified)
        
        require(flareAmount >= 1 ether, "Minimum donation not met");

        // Update tracking
        totalXrplDonations += xrplAmount;
        totalPool += flareAmount;
        donorXrplContributions[msg.sender] += xrplAmount;

        // Store cross-chain donation
        bytes32 donationHash = keccak256(abi.encodePacked(xrplTxHash, msg.sender, block.timestamp));
        crossChainDonations[donationHash] = CrossChainDonation({
            donor: msg.sender,
            amountWei: flareAmount,
            xrplAmount: xrplAmount,
            timestamp: block.timestamp,
            xrplTxHash: xrplTxHash,
            processed: true
        });
        donationHashes.push(donationHash);

        emit XrplDonationReceived(msg.sender, xrplAmount, xrplTxHash, flareAmount);
        
        // Award badge if significant contribution
        _awardBadgeIfEligible(msg.sender);
    }

    // Create emergency request
    function createRequest(
        string calldata invoiceId, 
        uint256 amountWei, 
        string calldata hospitalXrpl
    ) external returns (uint256) {
        uint256 id = nextRequestId++;
        requests[id] = Request({
            invoiceId: invoiceId,
            creator: msg.sender,
            hospitalXrpl: hospitalXrpl,
            amountWei: amountWei,
            funded: false,
            paidOut: false,
            fundedAt: 0,
            contributors: new address[](0)
        });
        
        emit RequestCreated(id, invoiceId, amountWei, hospitalXrpl);

        // Auto fund if pool has enough
        if (totalPool >= amountWei) {
            _fundRequest(id);
        }
        return id;
    }

    // Fund request with contributor tracking
    function _fundRequest(uint256 requestId) internal {
        Request storage r = requests[requestId];
        require(!r.funded, "Already funded");
        require(totalPool >= r.amountWei, "Insufficient pool");
        
        r.funded = true;
        r.fundedAt = block.timestamp;
        totalPool -= r.amountWei;
        
        // Track contributors (simplified - in production, calculate proportional contributions)
        r.contributors.push(msg.sender);
        
        emit RequestFunded(requestId, r.amountWei, r.hospitalXrpl, r.contributors);
    }

    // Manual funding by owner
    function fundRequest(uint256 requestId) external onlyOwner {
        _fundRequest(requestId);
    }

    // Mark as paid out
    function markPaidOut(uint256 requestId) external onlyOwner {
        Request storage r = requests[requestId];
        require(r.funded, "Not funded");
        require(!r.paidOut, "Already paid");
        r.paidOut = true;
        emit RequestPaidOut(requestId, r.amountWei, r.hospitalXrpl);
    }

    // Award badge based on contribution level
    function _awardBadgeIfEligible(address donor) internal {
        uint256 totalContributions = donorXrplContributions[donor] + donorFlareContributions[donor];
        
        // Award different badges based on contribution levels
        if (totalContributions >= 10 ether) {
            uint256 badgeId = badgeNft.mintBadge(donor);
            emit BadgeAwarded(donor, badgeId, totalContributions);
        }
    }

    // Get donor's total impact
    function getDonorImpact(address donor) external view returns (
        uint256 xrplContributions,
        uint256 flareContributions,
        uint256 totalContributions,
        uint256 requestsHelped
    ) {
        xrplContributions = donorXrplContributions[donor];
        flareContributions = donorFlareContributions[donor];
        totalContributions = xrplContributions + flareContributions;
        
        // Count requests this donor contributed to (simplified)
        requestsHelped = 0;
        for (uint256 i = 0; i < nextRequestId; i++) {
            if (requests[i].funded) {
                for (uint256 j = 0; j < requests[i].contributors.length; j++) {
                    if (requests[i].contributors[j] == donor) {
                        requestsHelped++;
                        break;
                    }
                }
            }
        }
    }

    // Get XRPL payment details for donors
    function getXrplPaymentDetails() external view returns (
        address receiver,
        string memory destinationTag,
        uint256 minAmount
    ) {
        return (xrplReceiverAddress, xrplDestinationTag, MIN_DONATION_AMOUNT);
    }

    // Verify XRPL transaction through FDC
    function isXrplTransactionProofValid(
        IEVMTransaction.Proof calldata transaction
    ) public view returns (bool) {
        IFdcVerification fdc = ContractRegistry.getFdcVerification();
        return fdc.verifyEVMTransaction(transaction);
    }

    // Fallback: accept direct transfers
    receive() external payable {
        totalPool += msg.value;
        donorFlareContributions[msg.sender] += msg.value;
        emit DonationMade(msg.sender, msg.value, block.timestamp);
        _awardBadgeIfEligible(msg.sender);
    }
}
