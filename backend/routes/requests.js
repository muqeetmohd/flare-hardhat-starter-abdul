const express = require('express');
const { body, validationResult } = require('express-validator');
const EmergencyRequest = require('../models/EmergencyRequest');
const User = require('../models/User');
const { authenticateToken, requireRole, requireVerification } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/requests
// @desc    Get all emergency requests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const requests = await EmergencyRequest.find(filter)
      .populate('hospital', 'username fullName hospitalInfo.name avatar')
      .populate('contributors.donor', 'username fullName avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await EmergencyRequest.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      error: error.message
    });
  }
});

// @route   GET /api/requests/active
// @desc    Get active emergency requests
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const requests = await EmergencyRequest.getActiveRequests();
    
    res.json({
      success: true,
      data: { requests }
    });
  } catch (error) {
    console.error('Get active requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active requests',
      error: error.message
    });
  }
});

// @route   GET /api/requests/:id
// @desc    Get single emergency request
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id)
      .populate('hospital', 'username fullName hospitalInfo avatar')
      .populate('contributors.donor', 'username fullName avatar')
      .populate('verification.verifiedBy', 'username fullName');
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    res.json({
      success: true,
      data: { request }
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request',
      error: error.message
    });
  }
});

// @route   POST /api/requests
// @desc    Create new emergency request
// @access  Private (Hospital)
router.post('/', authenticateToken, requireRole('hospital'), requireVerification, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('amountRequested').isNumeric().withMessage('Amount must be a number'),
  body('patientInfo.condition').notEmpty().withMessage('Patient condition is required'),
  body('patientInfo.urgency').isIn(['routine', 'urgent', 'emergency', 'life_threatening']).withMessage('Invalid urgency level')
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

    const {
      title,
      description,
      amountRequested,
      patientInfo,
      priority = 'medium',
      tags = [],
      location = {}
    } = req.body;

    // Generate unique invoice ID
    const invoiceId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Get hospital XRPL address
    const hospital = await User.findById(req.user._id);
    if (!hospital.hospitalInfo?.xrplAddress) {
      return res.status(400).json({
        success: false,
        message: 'Hospital XRPL address not configured'
      });
    }

    const requestData = {
      invoiceId,
      title,
      description,
      hospital: req.user._id,
      hospitalXrplAddress: hospital.hospitalInfo.xrplAddress,
      amountRequested,
      patientInfo,
      priority,
      tags,
      location
    };

    const request = new EmergencyRequest(requestData);
    await request.save();

    // Add to timeline
    request.timeline.push({
      action: 'created',
      description: 'Emergency request created',
      user: req.user._id
    });
    await request.save();

    // Emit real-time update
    req.io.to('donors').emit('new-request', {
      request: await request.populate('hospital', 'username fullName hospitalInfo.name')
    });

    res.status(201).json({
      success: true,
      message: 'Emergency request created successfully',
      data: { request }
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message
    });
  }
});

// @route   PUT /api/requests/:id/verify
// @desc    Verify emergency request
// @access  Private (Verifier/Admin)
router.put('/:id/verify', authenticateToken, requireRole('verifier', 'admin'), [
  body('verificationNotes').optional().isString()
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

    const { verificationNotes } = req.body;
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.verification.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Request already verified'
      });
    }

    await request.verify(req.user._id, verificationNotes);

    // Emit real-time update
    req.io.to('donors').emit('request-verified', {
      requestId: request._id,
      verified: true
    });

    res.json({
      success: true,
      message: 'Request verified successfully',
      data: { request }
    });

  } catch (error) {
    console.error('Verify request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify request',
      error: error.message
    });
  }
});

// @route   PUT /api/requests/:id/status
// @desc    Update request status
// @access  Private (Hospital/Admin)
router.put('/:id/status', authenticateToken, requireRole('hospital', 'admin'), [
  body('status').isIn(['pending', 'funded', 'paid_out', 'cancelled', 'expired']).withMessage('Invalid status'),
  body('description').optional().isString()
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

    const { status, description } = req.body;
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check ownership (hospital can only update their own requests)
    if (req.user.role === 'hospital' && request.hospital.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - not your request'
      });
    }

    await request.updateStatus(status, req.user._id, description);

    // Emit real-time update
    req.io.to('donors').emit('request-status-updated', {
      requestId: request._id,
      status,
      description
    });

    res.json({
      success: true,
      message: 'Request status updated successfully',
      data: { request }
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
});

// @route   GET /api/requests/hospital/:hospitalId
// @desc    Get requests by hospital
// @access  Public
router.get('/hospital/:hospitalId', async (req, res) => {
  try {
    const requests = await EmergencyRequest.getByHospital(req.params.hospitalId);
    
    res.json({
      success: true,
      data: { requests }
    });
  } catch (error) {
    console.error('Get hospital requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hospital requests',
      error: error.message
    });
  }
});

// @route   GET /api/requests/stats/overview
// @desc    Get request statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await EmergencyRequest.aggregate([
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalAmountRequested: { $sum: '$amountRequested' },
          totalAmountFunded: { $sum: '$amountFunded' },
          totalAmountPaidOut: { $sum: '$amountPaidOut' },
          avgFundingTime: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } }
        }
      }
    ]);

    const statusStats = await EmergencyRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await EmergencyRequest.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalRequests: 0,
          totalAmountRequested: 0,
          totalAmountFunded: 0,
          totalAmountPaidOut: 0,
          avgFundingTime: 0
        },
        statusBreakdown: statusStats,
        priorityBreakdown: priorityStats
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

module.exports = router;
