const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  { name: 'Burgers', slug: 'burgers', description: 'Juicy BBQ and classic burgers', order: 1 },
  { name: 'Wings', slug: 'wings', description: 'Spicy and crunchy chicken wings', order: 2 },
  { name: 'Pizza', slug: 'pizza', description: 'Freshly baked texas style pizza', order: 3 },
  { name: 'Sides', slug: 'sides', description: 'Fries, nuggets and more', order: 4 },
  { name: 'Beverages', slug: 'beverages', description: 'Cold drinks and shakes', order: 5 }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data (optional, but good for clean seed)
    // await User.deleteMany();
    // await Category.deleteMany();

    // Create Admin User
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', salt);
      
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@texasgrill.com',
        password: hashedPassword,
        phone: '1234567890',
        role: 'admin'
      });
      console.log('Admin user created');       
    } else {
      console.log('Admin user already exists');
    }

    // Create Categories
    for (const cat of categories) {
      const catExists = await Category.findOne({ slug: cat.slug });
      if (!catExists) {
        await Category.create(cat);
        console.log(`Category ${cat.name} created`);
      }
    }

    console.log('Data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
