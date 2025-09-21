const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Profile
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  
  // Role & Permissions
  role: {
    type: String,
    enum: ['donor', 'hospital', 'admin', 'verifier'],
    default: 'donor'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Hospital Specific
  hospitalInfo: {
    name: String,
    license: String,
    address: String,
    phone: String,
    website: String,
    xrplAddress: String
  },
  
  // Donation Stats
  donationStats: {
    totalDonated: {
      type: Number,
      default: 0
    },
    totalDonations: {
      type: Number,
      default: 0
    },
    livesHelped: {
      type: Number,
      default: 0
    },
    badgesEarned: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    }],
    currentBadgeLevel: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      default: 'bronze'
    }
  },
  
  // Subscription Info
  subscription: {
    isActive: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      default: 0
    },
    interval: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly'],
      default: 'monthly'
    },
    nextPayment: Date,
    paymentMethod: {
      type: String,
      enum: ['flare', 'xrpl', 'usdc'],
      default: 'flare'
    }
  },
  
  // Security
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  
  // Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['donation_received', 'request_created', 'request_funded', 'badge_earned', 'payment_processed'],
      required: true
    },
    title: String,
    message: String,
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Social Features
  socialLinks: {
    twitter: String,
    linkedin: String,
    website: String
  },
  
  // Privacy Settings
  privacy: {
    showDonations: {
      type: Boolean,
      default: true
    },
    showBadges: {
      type: Boolean,
      default: true
    },
    showLivesHelped: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.twoFactorEnabled;
  delete user.lastLogin;
  return user;
};

// Update donation stats
userSchema.methods.updateDonationStats = function(amount, livesHelped = 0) {
  this.donationStats.totalDonated += amount;
  this.donationStats.totalDonations += 1;
  this.donationStats.livesHelped += livesHelped;
  
  // Update badge level based on total donated
  if (this.donationStats.totalDonated >= 1000) {
    this.donationStats.currentBadgeLevel = 'diamond';
  } else if (this.donationStats.totalDonated >= 500) {
    this.donationStats.currentBadgeLevel = 'platinum';
  } else if (this.donationStats.totalDonated >= 100) {
    this.donationStats.currentBadgeLevel = 'gold';
  } else if (this.donationStats.totalDonated >= 50) {
    this.donationStats.currentBadgeLevel = 'silver';
  }
  
  return this.save();
};

// Add notification
userSchema.methods.addNotification = function(type, title, message) {
  this.notifications.unshift({
    type,
    title,
    message
  });
  
  // Keep only last 50 notifications
  if (this.notifications.length > 50) {
    this.notifications = this.notifications.slice(0, 50);
  }
  
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
