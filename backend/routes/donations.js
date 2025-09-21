const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/donations/process
// @desc    Process a donation
// @access  Private
router.post('/process', authenticateToken, [
  body('requestId').isMongoId().withMessage('Valid request ID required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('type').isIn(['flare', 'xrpl', 'usdc']).withMessage('Invalid donation type'),
  body('transactionHash').optional().isString()
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

    const { requestId, amount, type, transactionHash } = req.body;

    // Find the request
    const request = await EmergencyRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Add contributor to request
    await request.addContributor(req.user._id, amount, type, transactionHash);

    // Update user stats
    await req.user.updateDonationStats(amount, 1); // Assuming 1 life helped per donation

    // Add notification
    await req.user.addNotification(
      'donation_received',
      'Donation Processed',
      `Your ${amount} ${type.toUpperCase()} donation has been processed`
    );

    // Emit real-time update
    req.io.to(`user-${req.user._id}`).emit('donation-processed', {
      amount,
      type,
      requestId
    });

    req.io.to('donors').emit('donation-update', {
      requestId,
      newFunding: request.amountFunded
    });

    res.json({
      success: true,
      message: 'Donation processed successfully',
      data: {
        donation: {
          amount,
          type,
          requestId,
          transactionHash
        },
        updatedStats: req.user.donationStats
      }
    });

  } catch (error) {
    console.error('Process donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process donation',
      error: error.message
    });
  }
});

// @route   GET /api/donations/history/:userId
// @desc    Get user donation history
// @access  Private
router.get('/history/:userId', authenticateToken, async (req, res) => {
  try {
    // Check if user can access this data
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const donations = await EmergencyRequest.find({
      'contributors.donor': req.params.userId
    })
    .populate('hospital', 'username fullName hospitalInfo.name')
    .select('title amountRequested amountFunded contributors createdAt status')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { donations }
    });
  } catch (error) {
    console.error('Get donation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation history',
      error: error.message
    });
  }
});

module.exports = router;
