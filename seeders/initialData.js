const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const categories = [
  { name: 'Special Dishes', slug: 'special-dishes', description: 'Our chef's signature creations', order: 1 },
  { name: 'BBQ & Kababs', slug: 'bbq-kababs', description: 'Charcoal grilled perfection', order: 2 },
  { name: 'Karahi & Handi', slug: 'karahi-handi', description: 'Traditional clay pot delicacies', order: 3 },
  { name: 'Pizza & Fast Food', slug: 'pizza-fast-food', description: 'International favorites', order: 4 },
  { name: 'Rice & Biryani', slug: 'rice-biryani', description: 'Fragrant rice specialties', order: 5 },
  { name: 'Classic Curries', slug: 'classic-curries', description: 'Rich and creamy gravies', order: 6 },
  { name: 'Burgers', slug: 'burgers', description: 'Gourmet burgers and wraps', order: 7 },
  { name: 'Seafood', slug: 'seafood', description: 'Fresh catch of the day', order: 8 },
  { name: 'Beverages', slug: 'beverages', description: 'Refreshing drinks & shakes', order: 9 },
  { name: 'Desserts', slug: 'desserts', description: 'Sweet endings', order: 10 }
];

const menuItems = [
  { name: 'Dum Pukh', price: 2500, description: 'Traditional slow-cooked meat with authentic spices.', isPopular: true },
  { name: 'Arabian Live Mandi', price: 2800, description: 'Authentic Yemeni dish with specially spiced meat and rice.', isPopular: true },
  { name: 'Shinwari Mutton Karahi', price: 2400, description: 'Peshawari style mutton cooked with tomatoes.' },
  { name: 'Matka Pizza', price: 900, description: 'Our special cheesy pizza served in a Matka.', isPopular: true },
  { name: 'Special BBQ Platter', price: 3500, description: 'Massive assortment of BBQ items.', isPopular: true },
  { name: 'Crunchy Zinger Burger', price: 550, description: 'Crispy fried chicken breast.' },
  { name: 'Special Gur Tea', price: 150, description: 'Traditional milk tea with jaggery.' }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany();
    await MenuItem.deleteMany();
    console.log('Cleared existing data');

    const createdCategories = await Category.insertMany(categories);
    console.log(`Added ${createdCategories.length} categories`);

    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });

    const itemsWithCategories = menuItems.map(item => ({
      ...item,
      category: categoryMap['special dishes'] || createdCategories[0]._id
    }));

    await MenuItem.insertMany(itemsWithCategories);
    console.log(`Added ${itemsWithCategories.length} menu items`);

    console.log('✅ Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedData();