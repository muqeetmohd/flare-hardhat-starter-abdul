// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MultiTokenDonationPool is Ownable {
    using SafeERC20 for IERC20;
    
    uint256 public nextRequestId;
    uint256 public totalPoolFLR; // Total FLR in pool
    uint256 public totalPoolUSDC; // Total USDC in pool
    uint256 public totalPoolUSDT; // Total USDT in pool
    
    // Supported tokens
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenPools; // token => total amount
    
    struct Request {
        string invoiceId;
        address creator;
        string hospitalXrpl;
        uint256 amountWei;
        address tokenAddress; // address(0) for native FLR
        bool funded;
        bool paidOut;
        uint256 fundedAmount;
    }
    
    mapping(uint256 => Request) public requests;
    
    // Events
    event DonationMade(address indexed donor, uint256 amountWei, address tokenAddress, uint256 time);
    event RequestCreated(uint256 indexed requestId, string invoiceId, uint256 amountWei, string hospitalXrpl, address tokenAddress);
    event RequestFunded(uint256 indexed requestId, uint256 amountWei, address tokenAddress, string hospitalXrpl);
    event RequestPaidOut(uint256 indexed requestId, uint256 amountWei, address tokenAddress, string hospitalXrpl);
    event TokenSupported(address indexed token, bool supported);
    
    constructor() Ownable(msg.sender) {
        // Support native FLR by default
        supportedTokens[address(0)] = true;
    }
    
    // Add support for a new token
    function addSupportedToken(address tokenAddress) external onlyOwner {
        supportedTokens[tokenAddress] = true;
        emit TokenSupported(tokenAddress, true);
    }
    
    // Remove support for a token
    function removeSupportedToken(address tokenAddress) external onlyOwner {
        supportedTokens[tokenAddress] = false;
        emit TokenSupported(tokenAddress, false);
    }
    
    // Donate native FLR
    function donateFLR() external payable {
        require(msg.value > 0, "Must send value");
        totalPoolFLR += msg.value;
        tokenPools[address(0)] += msg.value;
        emit DonationMade(msg.sender, msg.value, address(0), block.timestamp);
    }
    
    // Donate ERC20 tokens
    function donateToken(address tokenAddress, uint256 amount) external {
        require(supportedTokens[tokenAddress], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20 token = IERC20(tokenAddress);
        token.safeTransferFrom(msg.sender, address(this), amount);
        
        tokenPools[tokenAddress] += amount;
        
        // Update specific token pools
        if (tokenAddress == address(0x1234567890123456789012345678901234567890)) { // USDC placeholder
            totalPoolUSDC += amount;
        } else if (tokenAddress == address(0x2345678901234567890123456789012345678901)) { // USDT placeholder
            totalPoolUSDT += amount;
        }
        
        emit DonationMade(msg.sender, amount, tokenAddress, block.timestamp);
    }
    
    // Create emergency request
    function createRequest(
        string calldata invoiceId, 
        uint256 amountWei, 
        string calldata hospitalXrpl,
        address tokenAddress
    ) external returns (uint256) {
        require(supportedTokens[tokenAddress], "Token not supported");
        
        uint256 id = nextRequestId++;
        requests[id] = Request({
            invoiceId: invoiceId,
            creator: msg.sender,
            hospitalXrpl: hospitalXrpl,
            amountWei: amountWei,
            tokenAddress: tokenAddress,
            funded: false,
            paidOut: false,
            fundedAmount: 0
        });
        
        emit RequestCreated(id, invoiceId, amountWei, hospitalXrpl, tokenAddress);
        
        // Auto fund if pool has enough
        if (tokenPools[tokenAddress] >= amountWei) {
            requests[id].funded = true;
            requests[id].fundedAmount = amountWei;
            tokenPools[tokenAddress] -= amountWei;
            
            // Update specific token pools
            if (tokenAddress == address(0)) {
                totalPoolFLR -= amountWei;
            } else if (tokenAddress == address(0x1234567890123456789012345678901234567890)) {
                totalPoolUSDC -= amountWei;
            } else if (tokenAddress == address(0x2345678901234567890123456789012345678901)) {
                totalPoolUSDT -= amountWei;
            }
            
            emit RequestFunded(id, amountWei, tokenAddress, hospitalXrpl);
        }
        
        return id;
    }
    
    // Fund request manually
    function fundRequest(uint256 requestId) external onlyOwner {
        Request storage r = requests[requestId];
        require(!r.funded, "Already funded");
        require(tokenPools[r.tokenAddress] >= r.amountWei, "Insufficient pool");
        
        r.funded = true;
        r.fundedAmount = r.amountWei;
        tokenPools[r.tokenAddress] -= r.amountWei;
        
        // Update specific token pools
        if (r.tokenAddress == address(0)) {
            totalPoolFLR -= r.amountWei;
        } else if (r.tokenAddress == address(0x1234567890123456789012345678901234567890)) {
            totalPoolUSDC -= r.amountWei;
        } else if (r.tokenAddress == address(0x2345678901234567890123456789012345678901)) {
            totalPoolUSDT -= r.amountWei;
        }
        
        emit RequestFunded(requestId, r.amountWei, r.tokenAddress, r.hospitalXrpl);
    }
    
    // Mark as paid out
    function markPaidOut(uint256 requestId) external onlyOwner {
        Request storage r = requests[requestId];
        require(r.funded, "Not funded");
        require(!r.paidOut, "Already paid");
        r.paidOut = true;
        emit RequestPaidOut(requestId, r.fundedAmount, r.tokenAddress, r.hospitalXrpl);
    }
    
    // Get request details
    function getRequest(uint256 id) external view returns (Request memory) {
        return requests[id];
    }
    
    // Get pool balance for a specific token
    function getPoolBalance(address tokenAddress) external view returns (uint256) {
        return tokenPools[tokenAddress];
    }
    
    // Get total pool value in FLR (would need price oracle for accurate conversion)
    function getTotalPoolValue() external view returns (uint256) {
        // This would need price oracle integration for accurate conversion
        return totalPoolFLR + totalPoolUSDC + totalPoolUSDT;
    }
    
    // Emergency withdrawal
    function emergencyWithdraw(address tokenAddress) external onlyOwner {
        if (tokenAddress == address(0)) {
            payable(owner()).transfer(address(this).balance);
        } else {
            IERC20 token = IERC20(tokenAddress);
            token.safeTransfer(owner(), token.balanceOf(address(this)));
        }
    }
    
    // Fallback: accept direct FLR transfers
    receive() external payable {
        totalPoolFLR += msg.value;
        tokenPools[address(0)] += msg.value;
        emit DonationMade(msg.sender, msg.value, address(0), block.timestamp);
    }
}
