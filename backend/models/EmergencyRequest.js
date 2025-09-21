const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  // Basic Info
  invoiceId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Hospital Info
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospitalXrplAddress: {
    type: String,
    required: true
  },
  
  // Financial Info
  amountRequested: {
    type: Number,
    required: true,
    min: 0
  },
  amountFunded: {
    type: Number,
    default: 0
  },
  amountPaidOut: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'funded', 'paid_out', 'cancelled', 'expired'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Medical Info
  patientInfo: {
    age: Number,
    condition: String,
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'emergency', 'life_threatening'],
      default: 'urgent'
    },
    estimatedDuration: String, // e.g., "2-3 days", "1 week"
    medicalDocuments: [String] // URLs to uploaded documents
  },
  
  // Verification
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    verificationNotes: String,
    documentsVerified: [String] // List of verified document types
  },
  
  // Funding
  contributors: [{
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    contributionType: {
      type: String,
      enum: ['flare', 'xrpl', 'usdc'],
      default: 'flare'
    },
    contributedAt: {
      type: Date,
      default: Date.now
    },
    transactionHash: String
  }],
  
  // Blockchain
  blockchain: {
    requestId: Number, // ID from smart contract
    transactionHash: String,
    blockNumber: Number,
    gasUsed: Number
  },
  
  // Timeline
  timeline: [{
    action: {
      type: String,
      enum: ['created', 'verified', 'funded', 'paid_out', 'cancelled'],
      required: true
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Impact
  impact: {
    livesSaved: {
      type: Number,
      default: 0
    },
    successStory: String,
    followUpNotes: String,
    photos: [String] // URLs to success photos
  },
  
  // Expiry
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  },
  
  // Tags for categorization
  tags: [String],
  
  // Location
  location: {
    country: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
emergencyRequestSchema.index({ status: 1, createdAt: -1 });
emergencyRequestSchema.index({ hospital: 1, status: 1 });
emergencyRequestSchema.index({ amountRequested: 1, status: 1 });
emergencyRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for funding percentage
emergencyRequestSchema.virtual('fundingPercentage').get(function() {
  if (this.amountRequested === 0) return 0;
  return Math.round((this.amountFunded / this.amountRequested) * 100);
});

// Virtual for time remaining
emergencyRequestSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const remaining = this.expiresAt - now;
  return remaining > 0 ? remaining : 0;
});

// Method to add contributor
emergencyRequestSchema.methods.addContributor = function(donorId, amount, contributionType, transactionHash) {
  this.contributors.push({
    donor: donorId,
    amount,
    contributionType,
    transactionHash
  });
  
  this.amountFunded += amount;
  
  // Add to timeline
  this.timeline.push({
    action: 'funded',
    description: `Received ${amount} ${contributionType.toUpperCase()} donation`,
    user: donorId
  });
  
  return this.save();
};

// Method to update status
emergencyRequestSchema.methods.updateStatus = function(newStatus, userId, description) {
  this.status = newStatus;
  
  this.timeline.push({
    action: newStatus,
    description: description || `Status changed to ${newStatus}`,
    user: userId
  });
  
  return this.save();
};

// Method to verify request
emergencyRequestSchema.methods.verify = function(verifierId, notes) {
  this.verification.isVerified = true;
  this.verification.verifiedBy = verifierId;
  this.verification.verifiedAt = new Date();
  this.verification.verificationNotes = notes;
  
  this.timeline.push({
    action: 'verified',
    description: 'Request verified by medical professional',
    user: verifierId
  });
  
  return this.save();
};

// Static method to get active requests
emergencyRequestSchema.statics.getActiveRequests = function() {
  return this.find({
    status: { $in: ['pending', 'funded'] },
    expiresAt: { $gt: new Date() }
  }).populate('hospital', 'username fullName hospitalInfo.name');
};

// Static method to get requests by hospital
emergencyRequestSchema.statics.getByHospital = function(hospitalId) {
  return this.find({ hospital: hospitalId })
    .populate('contributors.donor', 'username fullName avatar')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
