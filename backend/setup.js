#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('./models/User');
const Badge = require('./models/Badge');
require('dotenv').config({ path: './config.env' });

async function setupDatabase() {
  try {
    console.log('🚀 Setting up FlareHelp Database...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flarehelp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Initialize badges
    console.log('🏆 Initializing badges...');
    await Badge.initializeBadges();
    console.log('✅ Badges initialized');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        walletAddress: '0x0000000000000000000000000000000000000000',
        email: 'admin@flarehelp.com',
        username: 'admin',
        fullName: 'System Administrator',
        password: 'admin123456',
        role: 'admin',
        isVerified: true,
        verificationStatus: 'approved'
      });
      await admin.save();
      console.log('✅ Admin user created (email: admin@flarehelp.com, password: admin123456)');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create sample hospital user
    console.log('🏥 Creating sample hospital user...');
    const hospitalExists = await User.findOne({ role: 'hospital' });
    if (!hospitalExists) {
      const hospital = new User({
        walletAddress: '0x1111111111111111111111111111111111111111',
        email: 'hospital@flarehelp.com',
        username: 'sample_hospital',
        fullName: 'Sample Hospital',
        password: 'hospital123',
        role: 'hospital',
        isVerified: true,
        verificationStatus: 'approved',
        hospitalInfo: {
          name: 'Sample Medical Center',
          license: 'MED-12345',
          address: '123 Medical Street, Health City',
          phone: '+1-555-0123',
          website: 'https://samplehospital.com',
          xrplAddress: 'rSampleHospital123456789'
        }
      });
      await hospital.save();
      console.log('✅ Sample hospital created (email: hospital@flarehelp.com, password: hospital123)');
    } else {
      console.log('✅ Sample hospital already exists');
    }

    // Create sample donor user
    console.log('💙 Creating sample donor user...');
    const donorExists = await User.findOne({ role: 'donor' });
    if (!donorExists) {
      const donor = new User({
        walletAddress: '0x2222222222222222222222222222222222222222',
        email: 'donor@flarehelp.com',
        username: 'sample_donor',
        fullName: 'Sample Donor',
        password: 'donor123',
        role: 'donor',
        isVerified: true,
        verificationStatus: 'approved',
        donationStats: {
          totalDonated: 100,
          totalDonations: 5,
          livesHelped: 3,
          currentBadgeLevel: 'silver'
        }
      });
      await donor.save();
      console.log('✅ Sample donor created (email: donor@flarehelp.com, password: donor123)');
    } else {
      console.log('✅ Sample donor already exists');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Sample Users Created:');
    console.log('   Admin: admin@flarehelp.com / admin123456');
    console.log('   Hospital: hospital@flarehelp.com / hospital123');
    console.log('   Donor: donor@flarehelp.com / donor123');
    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
