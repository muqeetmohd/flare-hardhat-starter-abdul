// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationPool is Ownable {
    uint256 public nextRequestId;
    uint256 public totalPool; // total wei held in contract
    uint256 public totalDonations; // total donations received
    uint256 public totalLivesHelped; // total lives helped

    constructor() Ownable(msg.sender) {
        // Initialize with deployer as owner
    }

    struct Request {
        string invoiceId;
        address creator;
        string hospitalXrpl;
        uint256 amountWei;
        bool funded;
        bool paidOut;
        uint256 peopleHelped; // number of people this request helped
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        uint256 livesHelped; // lives helped by this specific donation
    }

    mapping(uint256 => Request) public requests;
    mapping(address => Donation[]) public donorHistory;
    mapping(address => uint256) public donorTotalDonated;
    mapping(address => uint256) public donorTotalLivesHelped;

    // track contributions & emit events so off-chain listener can reconstruct donors
    event DonationMade(address indexed donor, uint256 amountWei, uint256 time);
    event RequestCreated(uint256 indexed requestId, string invoiceId, uint256 amountWei, string hospitalXrpl);
    event RequestFunded(uint256 indexed requestId, uint256 amountWei, string hospitalXrpl);
    event RequestPaidOut(uint256 indexed requestId, uint256 amountWei, string hospitalXrpl);

    // donor sends native token (Coston2 native) to pool
    function donate() external payable {
        require(msg.value > 0, "Must send value");
        
        totalPool += msg.value;
        totalDonations += msg.value;
        
        // Calculate lives helped by this donation (assuming $50 per person helped)
        uint256 livesHelped = calculateLivesHelped(msg.value);
        totalLivesHelped += livesHelped;
        
        // Track donor history
        donorHistory[msg.sender].push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            livesHelped: livesHelped
        }));
        
        donorTotalDonated[msg.sender] += msg.value;
        donorTotalLivesHelped[msg.sender] += livesHelped;
        
        emit DonationMade(msg.sender, msg.value, block.timestamp);
    }
    
    // Calculate how many lives a donation amount can help
    function calculateLivesHelped(uint256 amountWei) public pure returns (uint256) {
        // Assuming $50 per person helped, and 1 ETH = $2000
        // So 1 person = 0.025 ETH = 25,000,000,000,000,000 wei
        uint256 costPerPerson = 25 * 10**15; // 0.025 ETH in wei
        return amountWei / costPerPerson;
    }

    // hospital (or owner) creates a request for amount in wei and hospital XRPL address
    function createRequest(string calldata invoiceId, uint256 amountWei, string calldata hospitalXrpl) external returns (uint256) {
        uint256 id = nextRequestId++;
        
        // Calculate how many people this request will help
        uint256 peopleHelped = calculateLivesHelped(amountWei);
        
        requests[id] = Request({
            invoiceId: invoiceId,
            creator: msg.sender,
            hospitalXrpl: hospitalXrpl,
            amountWei: amountWei,
            funded: false,
            paidOut: false,
            peopleHelped: peopleHelped
        });
        emit RequestCreated(id, invoiceId, amountWei, hospitalXrpl);

        // auto fund if pool has enough
        if (totalPool >= amountWei) {
            requests[id].funded = true;
            // decrease pool (we mark paidOut separate; actual cross-chain settlement done off-chain)
            totalPool -= amountWei;
            emit RequestFunded(id, amountWei, hospitalXrpl);
        }
        return id;
    }

    // owner or hospital admin can manually fund request (useful if pool gets topped)
    function fundRequest(uint256 requestId) external onlyOwner {
        Request storage r = requests[requestId];
        require(!r.funded, "Already funded");
        require(totalPool >= r.amountWei, "Insufficient pool");
        r.funded = true;
        totalPool -= r.amountWei;
        emit RequestFunded(requestId, r.amountWei, r.hospitalXrpl);
    }

    // mark as paid out on-chain (optional bookkeeping)
    function markPaidOut(uint256 requestId) external onlyOwner {
        Request storage r = requests[requestId];
        require(r.funded, "Not funded");
        require(!r.paidOut, "Already paid");
        r.paidOut = true;
        emit RequestPaidOut(requestId, r.amountWei, r.hospitalXrpl);
    }

    // convenience: get request count
    function getRequest(uint256 id) external view returns (Request memory) {
        return requests[id];
    }
    
    // Get donor's total impact
    function getDonorImpact(address donor) external view returns (uint256 totalDonated, uint256 totalLivesHelped, uint256 donationCount) {
        totalDonated = donorTotalDonated[donor];
        totalLivesHelped = donorTotalLivesHelped[donor];
        donationCount = donorHistory[donor].length;
    }
    
    // Get donor's donation history
    function getDonorHistory(address donor) external view returns (Donation[] memory) {
        return donorHistory[donor];
    }
    
    // Get all active requests for equal distribution calculation
    function getActiveRequests() external view returns (Request[] memory) {
        Request[] memory activeRequests = new Request[](nextRequestId);
        uint256 count = 0;
        
        for (uint256 i = 0; i < nextRequestId; i++) {
            if (!requests[i].funded) {
                activeRequests[count] = requests[i];
                count++;
            }
        }
        
        // Resize array to actual count
        Request[] memory result = new Request[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeRequests[i];
        }
        
        return result;
    }
    
    // Calculate equal distribution for a donation amount
    function calculateEqualDistribution(uint256 donationAmount) external view returns (uint256 perRequest, uint256 totalRequests) {
        totalRequests = 0;
        for (uint256 i = 0; i < nextRequestId; i++) {
            if (!requests[i].funded) {
                totalRequests++;
            }
        }
        
        if (totalRequests == 0) {
            perRequest = 0;
        } else {
            perRequest = donationAmount / totalRequests;
        }
    }

    // fallback: accept direct transfers
    receive() external payable {
        totalPool += msg.value;
        totalDonations += msg.value;
        
        // Calculate lives helped by this donation
        uint256 livesHelped = calculateLivesHelped(msg.value);
        totalLivesHelped += livesHelped;
        
        // Track donor history
        donorHistory[msg.sender].push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            livesHelped: livesHelped
        }));
        
        donorTotalDonated[msg.sender] += msg.value;
        donorTotalLivesHelped[msg.sender] += livesHelped;
        
        emit DonationMade(msg.sender, msg.value, block.timestamp);
    }
}
