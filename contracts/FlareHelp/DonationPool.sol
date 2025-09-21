// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationPool is Ownable {
    uint256 public nextRequestId;
    uint256 public totalPool; // total wei held in contract

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
    }

    mapping(uint256 => Request) public requests;

    // track contributions & emit events so off-chain listener can reconstruct donors
    event DonationMade(address indexed donor, uint256 amountWei, uint256 time);
    event RequestCreated(uint256 indexed requestId, string invoiceId, uint256 amountWei, string hospitalXrpl);
    event RequestFunded(uint256 indexed requestId, uint256 amountWei, string hospitalXrpl);
    event RequestPaidOut(uint256 indexed requestId, uint256 amountWei, string hospitalXrpl);

    // donor sends native token (Coston2 native) to pool
    function donate() external payable {
        require(msg.value > 0, "Must send value");
        totalPool += msg.value;
        emit DonationMade(msg.sender, msg.value, block.timestamp);
    }

    // hospital (or owner) creates a request for amount in wei and hospital XRPL address
    function createRequest(string calldata invoiceId, uint256 amountWei, string calldata hospitalXrpl) external returns (uint256) {
        uint256 id = nextRequestId++;
        requests[id] = Request({
            invoiceId: invoiceId,
            creator: msg.sender,
            hospitalXrpl: hospitalXrpl,
            amountWei: amountWei,
            funded: false,
            paidOut: false
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

    // fallback: accept direct transfers
    receive() external payable {
        totalPool += msg.value;
        emit DonationMade(msg.sender, msg.value, block.timestamp);
    }
}
