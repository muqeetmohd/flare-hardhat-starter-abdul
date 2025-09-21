const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:userId
// @desc    Get user profile
// @access  Public
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: { user: user.getPublicProfile() }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// @route   GET /api/users/impact/:userId
// @desc    Get user impact data
// @access  Public
router.get('/impact/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get requests this user contributed to
    const contributedRequests = await EmergencyRequest.find({
      'contributors.donor': req.params.userId
    }).populate('hospital', 'username fullName hospitalInfo.name');

    // Get requests created by this user (if hospital)
    const createdRequests = await EmergencyRequest.find({
      hospital: req.params.userId
    });

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile(),
        impact: {
          totalDonated: user.donationStats.totalDonated,
          totalDonations: user.donationStats.totalDonations,
          livesHelped: user.donationStats.livesHelped,
          currentBadgeLevel: user.donationStats.currentBadgeLevel,
          contributedRequests,
          createdRequests: user.role === 'hospital' ? createdRequests : []
        }
      }
    });
  } catch (error) {
    console.error('Get impact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch impact data',
      error: error.message
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get donor leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'totalDonated', limit = 10 } = req.query;
    
    const sortField = `donationStats.${type}`;
    const users = await User.find({ role: 'donor' })
      .select('username fullName avatar donationStats')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: { leaderboard: users }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
});

module.exports = router;
