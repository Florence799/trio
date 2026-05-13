const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    
    const adminExists = await User.findOne({ role: 'Admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
      process.exit();
    }

    const admin = new User({
      name: 'System Admin',
      email: 'admin@lms.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'Admin',
      registeredNumber: 'ADMIN01',
      mobile: '9999999999'
    });

    await admin.save();
    console.log('Admin account created successfully!');
    console.log('Email: admin@lms.com');
    console.log('Password: admin123');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
