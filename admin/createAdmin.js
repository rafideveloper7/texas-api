const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const existing = await User.findOne({ email: 'admin@texasgrill.com' });
    if (existing) {
       console.log('Admin already exists.');
       process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await User.create({
      name: 'Texas Grill Admin',
      email: 'admin@texasgrill.com',
      password: hashedPassword,
      phone: '03000000000',
      role: 'admin'
    });

    console.log('Admin user created successfully.');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

createAdmin();
