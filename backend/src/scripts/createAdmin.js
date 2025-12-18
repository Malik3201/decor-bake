import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { USER_ROLES } from '../config/constants.js';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: 'admin@decorbake.com',
      isDeleted: false 
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@decorbake.com');
      console.log('You can reset the password by updating the user in the database.');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@decorbake.com',
      password: 'admin123', // Default password - CHANGE THIS IN PRODUCTION!
      role: USER_ROLES.ADMIN,
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@decorbake.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();


