const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const updates = {
  'salads': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'breakfast': 'https://images.unsplash.com/photo-1544787210-2213d84ad96b',
  'broast': 'https://images.unsplash.com/photo-1562967914-608f82629710',
  'sandwiches': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
  'shawarma': 'https://images.unsplash.com/photo-1561651823-34feb02250e4',
  'appetizers': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877',
  'specialties': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8'
};

const syncCats = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const slug in updates) {
      await Category.updateOne(
        { slug },
        { $set: { image: { url: updates[slug], publicId: 'seed' } } }
      );
    }
    console.log('Categories synced with images.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

syncCats();
