const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const menuItems = [
  // Burgers & Sandwiches (Slug: burgers)
  { name: 'Texas Jalapeño Burger', category: 'burgers', price: 950, description: 'Double flame-grilled beef with spicy jalapeño and ranch.', isPopular: true },
  { name: 'Smokehouse BBQ Burger', category: 'burgers', price: 1100, description: 'Beef patty topped with crispy turkey bacon and onion rings.', isPopular: true },
  { name: 'Crispy Zinger Supreme', category: 'burgers', price: 780, description: 'Hand-breaded fried chicken with secret spice mix.', isPopular: false },
  { name: 'Philly Steak Sandwich', category: 'burgers', price: 1250, description: 'Thinly sliced beef steak with melted peppers and onions.', isPopular: true },
  { name: 'Chicken Club Sandwich', category: 'burgers', price: 850, description: 'Classic 3-layer sandwich with egg, chicken, and cheese.', isPopular: false },
  { name: 'Mushroom Melt Burger', category: 'burgers', price: 920, description: 'Sautéed mushrooms with swiss cheese on a soft bun.', isPopular: false },
  { name: 'Double Stack Classic', category: 'burgers', price: 1050, description: 'Two 150g beef patties with cheddar and pickles.', isPopular: true },
  { name: 'Peri Peri Wrap', category: 'burgers', price: 650, description: 'Grilled chicken strips in a soft tortilla with peri sauce.', isPopular: false },

  // BBQ & Kababs (Slug: bbq-kababs)
  { name: 'Texas Mixed Grill Platter', category: 'bbq-kababs', price: 2450, description: 'A massive spread of Lamb, Chicken, and Beef kababs.', isPopular: true },
  { name: 'Seekh Kabab (Beef)', category: 'bbq-kababs', price: 850, description: 'Traditional minced beef skewers with aromatic herbs.', isPopular: true },
  { name: 'Chicken Malai Boti', category: 'bbq-kababs', price: 950, description: 'Boneless chicken cubes in a creamy mild marinade.', isPopular: true },
  { name: 'Spicy Tikka Leg', category: 'bbq-kababs', price: 450, description: 'Quarter chicken leg marinated in hot red spices.', isPopular: false },
  { name: 'Lamb Chops (6 Pcs)', category: 'bbq-kababs', price: 1850, description: 'Tender grilled chops with a rosemary garlic crust.', isPopular: true },
  { name: 'Afghani Boti', category: 'bbq-kababs', price: 1100, description: 'Succulent chicken chunks with minimal salt and pepper.', isPopular: false },
  { name: 'Reshmi Kabab', category: 'bbq-kababs', price: 900, description: 'Silky smooth minced chicken skewers.', isPopular: false },
  { name: 'BBQ Fish Tikka', category: 'bbq-kababs', price: 1400, description: 'Charred fish cubes with a lemony mustard base.', isPopular: false },

  // Karahi & Handi (Slug: karahi-handi)
  { name: 'Desi Ghee Mutton Karahi', category: 'karahi-handi', price: 2800, description: 'Tender mutton cooked in pure clarified butter.', isPopular: true },
  { name: 'Chicken White Handi', category: 'karahi-handi', price: 1650, description: 'Boneless chicken in a rich white cream gravy.', isPopular: true },
  { name: 'Peshawari Charsi Tikka', category: 'karahi-handi', price: 1800, description: 'Legendary salt-cooked chicken in animal fat.', isPopular: true },
  { name: 'Paneer Reshmi Handi', category: 'karahi-handi', price: 1200, description: 'Vegetarian delight with cottage cheese in red gravy.', isPopular: false },
  { name: 'Mutton Shinwari Karahi', category: 'karahi-handi', price: 2950, description: 'Fresh mutton with tomatoes and minimal spices.', isPopular: false },
  { name: 'Butter Chicken Special', category: 'karahi-handi', price: 1550, description: 'Classic buttery tomato base with roasted chicken.', isPopular: true },
  { name: 'Brain Masala Handi', category: 'karahi-handi', price: 1950, description: 'Exotic dish for traditional spice lovers.', isPopular: false },
  { name: 'Achari Chicken Karahi', category: 'karahi-handi', price: 1500, description: 'Tangy pickled spice blend with tender chicken.', isPopular: false },

  // Pizza & Fast Food (Slug: pizza-fast-food)
  { name: 'Texas BBQ Chicken Pizza', category: 'pizza-fast-food', price: 1450, description: 'BBQ sauce base with grilled chicken and red onions.', isPopular: true },
  { name: 'The Pepperoni Beast', category: 'pizza-fast-food', price: 1350, description: 'Loaded with double layers of spicy pepperoni.', isPopular: true },
  { name: 'Margherita Fresca', category: 'pizza-fast-food', price: 1150, description: 'Simple basil, tomato, and fresh mozzarella.', isPopular: false },
  { name: 'Beef Lasagna', category: 'pizza-fast-food', price: 950, description: 'Layers of beef, pasta, and 3 types of cheese.', isPopular: false },
  { name: 'Pasta Carbonara', category: 'pizza-fast-food', price: 880, description: 'Creamy white sauce with turkey bacon bits.', isPopular: true },
  { name: 'Crispy Fish & Chips', category: 'pizza-fast-food', price: 1200, description: 'Golden batter fish with tartar sauce.', isPopular: false },
  { name: 'Buffalo Wings (12 Pcs)', category: 'pizza-fast-food', price: 850, description: 'Spicy, tangy and everything you want in wings.', isPopular: true },
  { name: 'Vegetable Supreme Pizza', category: 'pizza-fast-food', price: 1250, description: 'Fresh peppers, corn, mushrooms and olives.', isPopular: false },

  // Rice & Biryani (Slug: rice-biryani)
  { name: 'Premium Mutton Biryani', category: 'rice-biryani', price: 950, description: 'Long-grain basmati with melt-in-mouth mutton.', isPopular: true },
  { name: 'Chicken Tikka Biryani', category: 'rice-biryani', price: 750, description: 'Spicy biryani topped with a whole Tikka piece.', isPopular: true },
  { name: 'Egg Fried Rice', category: 'rice-biryani', price: 550, description: 'Wok-tossed rice with spring onions and eggs.', isPopular: false },
  { name: 'Beef Pulao (Texas Style)', category: 'rice-biryani', price: 850, description: 'Aromatic mild rice with tender beef chunks.', isPopular: false },
  { name: 'Chicken Manchurian w/ Rice', category: 'rice-biryani', price: 900, description: 'Classic fusion dish served with steamed rice.', isPopular: true },
  { name: 'Vegetable Pulao', category: 'rice-biryani', price: 500, description: 'Nutritious mix of seasonal vegetables and rice.', isPopular: false },
  { name: 'Kabuli Pulao', category: 'rice-biryani', price: 1100, description: 'Sweet and savory rice with carrots and raisins.', isPopular: true },
  { name: 'Hyderabadi Dum Biryani', category: 'rice-biryani', price: 800, description: 'Deeply spiced and slow-cooked to perfection.', isPopular: false },

  // Beverages (Slug: beverages)
  { name: 'Texas Oreo Shake', category: 'beverages', price: 550, description: 'Thick chocolate shake with oreo chunks.', isPopular: true },
  { name: 'Mint Margarita', category: 'beverages', price: 350, description: 'Refreshing frozen mint and lime fusion.', isPopular: true },
  { name: 'Classic Cold Coffee', category: 'beverages', price: 480, description: 'Strong brew mixed with creamy milk.', isPopular: false },
  { name: 'Fresh Seasonal Juice', category: 'beverages', price: 400, description: '100% pure fresh fruit extraction.', isPopular: true },
  { name: 'Peach Ice Tea', category: 'beverages', price: 320, description: 'Housemade brew with natural peach notes.', isPopular: false },
  { name: 'Pina Colada', category: 'beverages', price: 580, description: 'Tropical coconut and pineapple delight.', isPopular: true },
  { name: 'Gourmet Hot Chocolate', category: 'beverages', price: 450, description: 'Real melted chocolate with marshmallows.', isPopular: false },
  { name: 'Mineral Water (Large)', category: 'beverages', price: 150, description: 'Pure chilled drinking water.', isPopular: false }
];

const seedMenu = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Successfully connected to ${conn.connection.name}`);

    // Map categories to IDs
    const dbCategories = await Category.find({});
    console.log(`Categories found in DB: ${dbCategories.length}`);
    const catMap = {};
    dbCategories.forEach(c => {
      catMap[c.slug] = c._id;
    });
    console.log('Mapping Slugs:', Object.keys(catMap));

    console.log('Clearing existing menu items...');
    const delResult = await MenuItem.deleteMany({});
    console.log(`Deleted ${delResult.deletedCount} items.`);

    const itemsToInsert = menuItems.map(item => {
      const catId = catMap[item.category];
      if (!catId) console.warn(`Warning: Category slug "${item.category}" not found in DB for item "${item.name}"`);
      return {
        ...item,
        category: catId,
        image: {
          url: `https://nexus.theforage.com/api/v1/asset-link?id=texas_${item.name.toLowerCase().replace(/ /g, '_')}`,
          publicId: 'fake'
        }
      };
    }).filter(i => i.category); // Only insert if category found

    console.log(`Preparing to insert ${itemsToInsert.length} items...`);
    await MenuItem.insertMany(itemsToInsert);
    console.log(`${itemsToInsert.length} items successfully seeded!`);
    
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedMenu();
