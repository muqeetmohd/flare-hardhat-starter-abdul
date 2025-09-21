const express = require('express');
const { ethers } = require('ethers');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Initialize provider and contracts
const provider = new ethers.JsonRpcProvider(process.env.FLARE_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract ABIs (simplified)
const DONATION_POOL_ABI = [
  "function donate() external payable",
  "function createRequest(string memory invoiceId, uint256 amountWei, string memory hospitalXrpl) external returns (uint256)",
  "function getXrplPaymentDetails() external view returns (address, string memory, uint256)",
  "function totalPool() external view returns (uint256)",
  "function nextRequestId() external view returns (uint256)"
];

const BADGE_NFT_ABI = [
  "function mintBadge(address to) external returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)"
];

const RECURRING_MANAGER_ABI = [
  "function createSubscription(uint256 amountWei, uint256 intervalDays, bool isXrpl, string memory xrplAddress) external",
  "function totalActiveSubscriptions() external view returns (uint256)",
  "function totalRecurringVolume() external view returns (uint256)"
];

// Initialize contracts
const donationPool = new ethers.Contract(
  process.env.DONATION_POOL_ADDRESS,
  DONATION_POOL_ABI,
  wallet
);

const badgeNft = new ethers.Contract(
  process.env.BADGE_NFT_ADDRESS,
  BADGE_NFT_ABI,
  wallet
);

const recurringManager = new ethers.Contract(
  process.env.RECURRING_MANAGER_ADDRESS,
  RECURRING_MANAGER_ABI,
  wallet
);

// @route   GET /api/blockchain/pool-stats
// @desc    Get donation pool statistics
// @access  Public
router.get('/pool-stats', async (req, res) => {
  try {
    const [totalPool, nextRequestId] = await Promise.all([
      donationPool.totalPool(),
      donationPool.nextRequestId()
    ]);

    res.json({
      success: true,
      data: {
        totalPool: ethers.formatEther(totalPool),
        nextRequestId: nextRequestId.toString(),
        poolAddress: process.env.DONATION_POOL_ADDRESS
      }
    });
  } catch (error) {
    console.error('Get pool stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pool statistics',
      error: error.message
    });
  }
});

// @route   GET /api/blockchain/xrpl-details
// @desc    Get XRPL payment details
// @access  Public
router.get('/xrpl-details', async (req, res) => {
  try {
    const [receiver, destinationTag, minAmount] = await donationPool.getXrplPaymentDetails();
    
    res.json({
      success: true,
      data: {
        receiver,
        destinationTag,
        minAmount: minAmount.toString(),
        minAmountXrp: (Number(minAmount) / 1000000).toString()
      }
    });
  } catch (error) {
    console.error('Get XRPL details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch XRPL details',
      error: error.message
    });
  }
});

// @route   POST /api/blockchain/donate
// @desc    Process Flare donation
// @access  Private
router.post('/donate', authenticateToken, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('requestId').optional().isMongoId().withMessage('Invalid request ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, requestId } = req.body;
    const amountWei = ethers.parseEther(amount.toString());

    // Send donation transaction
    const tx = await donationPool.donate({ value: amountWei });
    await tx.wait();

    res.json({
      success: true,
      message: 'Donation sent successfully',
      data: {
        transactionHash: tx.hash,
        amount: amount,
        requestId
      }
    });

  } catch (error) {
    console.error('Donate error:', error);
    res.status(500).json({
      success: false,
      message: 'Donation failed',
      error: error.message
    });
  }
});

// @route   POST /api/blockchain/create-request
// @desc    Create emergency request on blockchain
// @access  Private
router.post('/create-request', authenticateToken, [
  body('invoiceId').notEmpty().withMessage('Invoice ID required'),
  body('amountWei').isNumeric().withMessage('Amount must be a number'),
  body('hospitalXrpl').notEmpty().withMessage('Hospital XRPL address required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { invoiceId, amountWei, hospitalXrpl } = req.body;

    // Create request on blockchain
    const tx = await donationPool.createRequest(invoiceId, amountWei, hospitalXrpl);
    const receipt = await tx.wait();

    // Extract request ID from event logs
    const event = receipt.logs.find(log => {
      try {
        const parsed = donationPool.interface.parseLog(log);
        return parsed.name === 'RequestCreated';
      } catch {
        return false;
      }
    });

    let requestId = null;
    if (event) {
      const parsed = donationPool.interface.parseLog(event);
      requestId = parsed.args.requestId.toString();
    }

    res.json({
      success: true,
      message: 'Request created on blockchain',
      data: {
        transactionHash: tx.hash,
        requestId,
        invoiceId,
        amountWei: amountWei.toString()
      }
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create request on blockchain',
      error: error.message
    });
  }
});

// @route   GET /api/blockchain/user-badges/:address
// @desc    Get user's badge count from blockchain
// @access  Public
router.get('/user-badges/:address', async (req, res) => {
  try {
    const balance = await badgeNft.balanceOf(req.params.address);
    
    res.json({
      success: true,
      data: {
        badgeCount: balance.toString(),
        contractAddress: process.env.BADGE_NFT_ADDRESS
      }
    });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user badges',
      error: error.message
    });
  }
});

// @route   GET /api/blockchain/subscription-stats
// @desc    Get recurring subscription statistics
// @access  Public
router.get('/subscription-stats', async (req, res) => {
  try {
    const [activeSubscriptions, recurringVolume] = await Promise.all([
      recurringManager.totalActiveSubscriptions(),
      recurringManager.totalRecurringVolume()
    ]);

    res.json({
      success: true,
      data: {
        activeSubscriptions: activeSubscriptions.toString(),
        recurringVolume: ethers.formatEther(recurringVolume),
        contractAddress: process.env.RECURRING_MANAGER_ADDRESS
      }
    });
  } catch (error) {
    console.error('Get subscription stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription statistics',
      error: error.message
    });
  }
});

module.exports = router;
