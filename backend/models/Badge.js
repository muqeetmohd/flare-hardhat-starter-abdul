const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  
  // Badge Level
  level: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    required: true
  },
  
  // Requirements
  requirements: {
    minDonations: {
      type: Number,
      default: 0
    },
    minAmount: {
      type: Number,
      default: 0
    },
    minLivesHelped: {
      type: Number,
      default: 0
    },
    specialConditions: [String] // e.g., "first_donation", "monthly_donor", "emergency_hero"
  },
  
  // Rarity
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  
  // Blockchain
  tokenId: {
    type: Number,
    unique: true,
    sparse: true
  },
  contractAddress: {
    type: String,
    default: process.env.BADGE_NFT_ADDRESS
  },
  
  // Stats
  stats: {
    totalEarned: {
      type: Number,
      default: 0
    },
    holders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  
  // Display
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Social
  shareMessage: String, // Message when sharing this badge
  socialImage: String // Special image for social sharing
}, {
  timestamps: true
});

// Index for efficient queries
badgeSchema.index({ level: 1, rarity: 1 });
badgeSchema.index({ isActive: 1, displayOrder: 1 });

// Method to check if user qualifies for badge
badgeSchema.methods.checkEligibility = function(userStats) {
  const { totalDonations, totalDonated, livesHelped } = userStats;
  
  return (
    totalDonations >= this.requirements.minDonations &&
    totalDonated >= this.requirements.minAmount &&
    livesHelped >= this.requirements.minLivesHelped
  );
};

// Method to award badge to user
badgeSchema.methods.awardToUser = async function(userId) {
  if (!this.stats.holders.includes(userId)) {
    this.stats.holders.push(userId);
    this.stats.totalEarned += 1;
    await this.save();
  }
  return this;
};

// Static method to get available badges for user
badgeSchema.statics.getAvailableForUser = function(userStats) {
  return this.find({ isActive: true }).then(badges => {
    return badges.filter(badge => badge.checkEligibility(userStats));
  });
};

// Static method to get user's badges
badgeSchema.statics.getUserBadges = function(userId) {
  return this.find({
    'stats.holders': userId,
    isActive: true
  }).sort({ displayOrder: 1, level: 1 });
};

// Predefined badges
const predefinedBadges = [
  {
    name: 'First Donation',
    description: 'Made your first donation to help save lives',
    level: 'bronze',
    rarity: 'common',
    requirements: { minDonations: 1 },
    shareMessage: 'I just made my first donation to help save lives! 💙'
  },
  {
    name: 'Regular Helper',
    description: 'Made 10 donations to the community',
    level: 'silver',
    rarity: 'uncommon',
    requirements: { minDonations: 10 },
    shareMessage: 'I\'m a regular helper with 10+ donations! 🌟'
  },
  {
    name: 'Life Saver',
    description: 'Helped save 5 lives through your donations',
    level: 'gold',
    rarity: 'rare',
    requirements: { minLivesHelped: 5 },
    shareMessage: 'I\'ve helped save 5 lives! 🏥💙'
  },
  {
    name: 'Emergency Hero',
    description: 'Contributed to 3 emergency requests',
    level: 'platinum',
    rarity: 'epic',
    requirements: { minDonations: 3, specialConditions: ['emergency_hero'] },
    shareMessage: 'I\'m an Emergency Hero! 🚨💪'
  },
  {
    name: 'Diamond Donor',
    description: 'Donated over $1000 to save lives',
    level: 'diamond',
    rarity: 'legendary',
    requirements: { minAmount: 1000 },
    shareMessage: 'I\'m a Diamond Donor with $1000+ in donations! 💎'
  },
  {
    name: 'Monthly Supporter',
    description: 'Set up recurring monthly donations',
    level: 'silver',
    rarity: 'uncommon',
    requirements: { specialConditions: ['monthly_donor'] },
    shareMessage: 'I\'m a monthly supporter! 📅💙'
  },
  {
    name: 'Cross-Chain Champion',
    description: 'Donated using both Flare and XRPL',
    level: 'gold',
    rarity: 'rare',
    requirements: { specialConditions: ['cross_chain_donor'] },
    shareMessage: 'I\'m a Cross-Chain Champion! 🌐💙'
  }
];

// Method to initialize predefined badges
badgeSchema.statics.initializeBadges = async function() {
  for (const badgeData of predefinedBadges) {
    const existingBadge = await this.findOne({ name: badgeData.name });
    if (!existingBadge) {
      await this.create({
        ...badgeData,
        image: `/images/badges/${badgeData.level}_${badgeData.name.toLowerCase().replace(/\s+/g, '_')}.png`,
        socialImage: `/images/badges/social_${badgeData.level}_${badgeData.name.toLowerCase().replace(/\s+/g, '_')}.png`
      });
    }
  }
};

module.exports = mongoose.model('Badge', badgeSchema);
