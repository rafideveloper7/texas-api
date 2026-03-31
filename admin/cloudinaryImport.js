const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const categoryData = [
  { name: 'Special Dishes', slug: 'special-dishes', description: 'Our chef\'s signature creations', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
  { name: 'BBQ & Kababs', slug: 'bbq-kababs', description: 'Charcoal grilled perfection', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1' },
  { name: 'Karahi & Handi', slug: 'karahi-handi', description: 'Traditional clay pot delicacies', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398' },
  { name: 'Pizza & Fast Food', slug: 'pizza-fast-food', description: 'International favorites', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
  { name: 'Rice & Biryani', slug: 'rice-biryani', description: 'Fragrant rice specialties', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8' },
  { name: 'Classic Curries', slug: 'classic-curries', description: 'Rich and creamy gravies', imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db' },
  { name: 'Burgers & Sandwiches', slug: 'burgers', description: 'Gourmet burgers and wraps', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add' },
  { name: 'Seafood', slug: 'seafood', description: 'Fresh catch of the day', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2' },
  { name: 'Beverages', slug: 'beverages', description: 'Refreshing drinks & shakes', imageUrl: 'https://images.unsplash.com/photo-1544145945-f904253db0ad' },
  { name: 'Desserts', slug: 'desserts', description: 'Sweet endings', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb' }
];

const menuItemData = [
  { name: 'Dum Pukh', category: 'special-dishes', price: 2500, description: 'Traditional slow-cooked meat with authentic spices.', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947', isPopular: true },
  { name: 'Arabian Live Mandi', category: 'special-dishes', price: 2800, description: 'Authentic Yemeni dish with specially spiced meat and rice.', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8', isPopular: true },
  { name: 'Shinwari Mutton Karahi', category: 'karahi-handi', price: 2400, description: 'Peshawari style mutton cooked with tomatoes.', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398' },
  { name: 'Matka Pizza', category: 'pizza-fast-food', price: 900, description: 'Our special cheesy pizza served in a Matka.', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591', isPopular: true },
  { name: 'Special BBQ Platter', category: 'special-dishes', price: 3500, description: 'Massive assortment of BBQ items.', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', isPopular: true },
  { name: 'Crunchy Zinger Burger', category: 'bbq-kababs', price: 550, description: 'Crispy fried chicken breast.', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add' },
  { name: 'Special Gur Tea', category: 'beverages', price: 150, description: 'Traditional milk tea with jaggery.', imageUrl: 'https://images.unsplash.com/photo-1544145945-f904253db0ad' }
];

async function uploadToCloudinary(url, folder) {
  try {
    const result = await cloudinary.uploader.upload(url, { folder: `texas_grill/${folder}` });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error(`Upload failed for ${url}:`, error.message);
    return null;
  }
}

async function startAdminImport() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Admin connected to Atlas...');

    // Clear existing to avoid duplicates in this specific task
    await Category.deleteMany();
    await MenuItem.deleteMany();

    const categoryMap = {};

    console.log('Processing Categories...');
    for (const cat of categoryData) {
      const img = await uploadToCloudinary(cat.imageUrl, 'categories');
      const newCat = await Category.create({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: img || { url: cat.imageUrl, publicId: 'none' }
      });
      categoryMap[cat.slug] = newCat._id;
      console.log(`- Added: ${cat.name}`);
    }

    console.log('Processing Menu Items...');
    for (const item of menuItemData) {
      const img = await uploadToCloudinary(item.imageUrl, 'menu_items');
      await MenuItem.create({
        name: item.name,
        category: categoryMap[item.category],
        price: item.price,
        description: item.description,
        image: img || { url: item.imageUrl, publicId: 'none' },
        isPopular: item.isPopular || false
      });
      console.log(`- Added: ${item.name}`);
    }

    console.log('✅ Admin Task Complete: Data added with Cloudinary images.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Admin Task Failed:', err);
    process.exit(1);
  }
}

startAdminImport();
