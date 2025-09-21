const express = require('express');
const Badge = require('../models/Badge');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/badges
// @desc    Get all badges
// @access  Public
router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true })
      .sort({ displayOrder: 1, level: 1 });
    
    res.json({
      success: true,
      data: { badges }
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badges',
      error: error.message
    });
  }
});

// @route   GET /api/badges/user/:userId
// @desc    Get user's badges
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const badges = await Badge.getUserBadges(req.params.userId);
    
    res.json({
      success: true,
      data: { badges }
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

// @route   POST /api/badges/check-eligibility
// @desc    Check if user is eligible for new badges
// @access  Private
router.post('/check-eligibility', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const availableBadges = await Badge.getAvailableForUser(user.donationStats);
    
    res.json({
      success: true,
      data: { availableBadges }
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check badge eligibility',
      error: error.message
    });
  }
});

module.exports = router;
