import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { USER_ROLES } from '../config/constants.js';

// Load environment variables
dotenv.config();

const verifyAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected\n');

    // Check if admin exists
    const admin = await User.findOne({ 
      email: 'admin@decorbake.com',
      isDeleted: false 
    }).select('+password');

    if (!admin) {
      console.log('❌ Admin user does NOT exist!');
      console.log('Run: npm run create-admin\n');
      process.exit(1);
    }

    console.log('✅ Admin user found!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔐 Role:', admin.role);
    console.log('📅 Created:', admin.createdAt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Test password
    const testPassword = 'admin123';
    const isMatch = await admin.matchPassword(testPassword);
    
    if (isMatch) {
      console.log('✅ Password "admin123" is correct!');
    } else {
      console.log('❌ Password "admin123" does NOT match!');
      console.log('The password may have been changed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyAdmin();


