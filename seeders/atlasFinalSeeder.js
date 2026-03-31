const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const fullData = {
  categories: [
    { name: 'Rice & Biryani', slug: 'rice-biryani', description: 'Authentic Kabli and Karachi style rice' },
    { name: 'Ice Cream Parlor', slug: 'ice-cream', description: 'Premium frozen delights and toppings' },
    { name: 'Salads & Sides', slug: 'salads', description: 'Russian and fresh garden salads' },
    { name: 'Lassi & Desserts', slug: 'desserts', description: 'Special artisan shakes and sweet endings' },
    { name: 'Fresh Shakes & Juices', slug: 'beverages', description: '100% pure seasonal fruit extracts' },
    { name: 'Breakfast Menu', slug: 'breakfast', description: 'Paratas, Omelettes and Morning Teas' },
    { name: 'Burgers & Wraps', slug: 'burgers', description: 'Zinger and grilled signature burgers' },
    { name: 'Crispy Broast', slug: 'broast', description: 'Garlic and Masala infused crispy chicken' },
    { name: 'Gourmet Sandwiches', slug: 'sandwiches', description: 'Club and BBQ grilled sandwiches' },
    { name: 'Shawarma & Rolls', slug: 'shawarma', description: 'Traditional and Zinger style rolls' },
    { name: 'Fries & Appetizers', slug: 'appetizers', description: 'Loaded fries and finger fish' },
    { name: 'Traditional Pizza', slug: 'pizza', description: 'Deep dish and thin crust specialties' },
    { name: 'Special Dishes', slug: 'specialties', description: 'Mandi, Dam Pukh and Platter' },
    { name: 'Karahi & Handi', slug: 'karahi-handi', description: 'Shinwari and White gravy clay-pot cooking' },
    { name: 'BBQ & Kababs', slug: 'bbq-kababs', description: 'Charcoal grilled skewers and tikka' }
  ],
  items: [
    // Rice
    { name: 'Kabli Pulao', cat: 'rice-biryani', price: 950, desc: 'Tender meat with carrots and raisins over aromatic rice' },
    { name: 'Karachi Biryani', cat: 'rice-biryani', price: 750, desc: 'Spicy Sindhi style chicken biryani' },
    { name: 'Champ Roash', cat: 'rice-biryani', price: 1200, desc: 'Traditional slow-cooked mutton roast' },
    { name: 'Chicken Korma', cat: 'rice-biryani', price: 850, desc: 'Rich yogurt-based chicken curry' },

    // Ice Cream
    { name: 'Pista Ice Cream', cat: 'ice-cream', price: 80, desc: 'Classic pistachio flavor with real nut bits' },
    { name: 'Kolfa Special', cat: 'ice-cream', price: 80, desc: 'Traditional desi kulfa with saffron notes' },
    { name: 'Blue Berry Scoop', cat: 'ice-cream', price: 80, desc: 'Wild blueberry fruit blend' },
    { name: 'Bounty Special', cat: 'ice-cream', price: 80, desc: 'Coconut chocolate infused treat' },

    // Salad
    { name: 'Russian Salad', cat: 'salads', price: 350, desc: 'Creamy fruit and vegetable medley' },
    { name: 'Fruit Punch', cat: 'salads', price: 400, desc: 'Mixed liquid fruit delight' },
    { name: 'Fruit Special Chat', cat: 'salads', price: 350, desc: 'Sweet and spicy fruit mix' },

    // Shakes
    { name: 'Special Kit Shake', cat: 'desserts', price: 350, desc: 'KitKat chocolate blended thick shake' },
    { name: 'Special Oreo Shake', cat: 'desserts', price: 350, desc: 'Double oreo cream blend' },
    { name: 'Protein Shake', cat: 'desserts', price: 350, desc: 'Vanilla whey protein healthy boost' },

    // Juices
    { name: 'Fresh Anar Juice', cat: 'beverages', price: 400, desc: 'Pure pomegranate squeeze' },
    { name: 'Mango Lassi', cat: 'beverages', price: 200, desc: 'Creamy yogurt mango blend' },

    // Breakfast
    { name: 'Tandoori Parata', cat: 'breakfast', price: 80, desc: 'Clay oven baked crispy bread' },
    { name: 'Gur Tea', cat: 'breakfast', price: 100, desc: 'Traditional jaggery infused milk tea' },

    // Burgers
    { name: 'Zinger Cheese Burger', cat: 'burgers', price: 520, desc: 'Crunchy fillet with melting cheddar' },
    { name: 'Beef Double Cheese', cat: 'burgers', price: 570, desc: 'Two beef patties with extra American cheese' },
    { name: 'Chicken Grill Burger', cat: 'burgers', price: 650, desc: 'Perfectly charred breast fillet with herbs' },

    // Broast
    { name: 'Quarter Broast', cat: 'broast', price: 550, desc: 'Deep fried crispy chicken with garlic sauce' },
    { name: 'Full Broast', cat: 'broast', price: 2100, desc: 'Whole crispy chicken feast' },

    // Sandwiches
    { name: 'Club Cheese Sandwich', cat: 'sandwiches', price: 520, desc: '3-layer classic with egg and cheese' },
    { name: 'BBQ Sandwich', cat: 'sandwiches', price: 550, desc: 'Grilled chicken with hickory smoke sauce' },

    // Shawarma
    { name: 'Zinger Cheese Shawarma', cat: 'shawarma', price: 320, desc: 'Pita wrap with crunchy zinger bits' },
    { name: 'Chicken Parata Roll', cat: 'shawarma', price: 300, desc: 'Traditional kebab in fried parata' },

    // Fries
    { name: 'Loaded Fries', cat: 'appetizers', price: 700, desc: 'Topped with chicken chunks, mayo and cheese' },
    { name: 'Finger Fish (4 pcs)', cat: 'appetizers', price: 650, desc: 'Battered fish strips with tartar dip' },

    // Pizza
    { name: 'Texas Special Deep Dish', cat: 'pizza', price: 1160, desc: 'Double crust, extra cheese, red sauce secret blend' },
    { name: 'Alfredo Deep Dish Pizza', cat: 'pizza', price: 1160, desc: 'White alfredo base with juicy chicken and mushrooms' },
    { name: 'Beef Loaded Pizza', cat: 'pizza', price: 1160, desc: 'Premium ground beef and veggie supreme' },

    // Special
    { name: 'Mutton Mandi', cat: 'specialties', price: 3400, desc: 'Arabian style rice with tender lamb shoulder' },
    { name: 'Matka Beef Bannu Pulao', cat: 'specialties', price: 3200, desc: 'Clay pot cooked spicy beef rice' },

    // Karahi
    { name: 'Shinwari Mutton Karahi', cat: 'karahi-handi', price: 1600, desc: 'Minimal spice, tomato-based lamb specialty' },
    { name: 'White Chicken Karahi', cat: 'karahi-handi', price: 950, desc: 'Creamy yogurt base with boneless chicken' },

    // BBQ
    { name: 'Chicken Tikka Leg', cat: 'bbq-kababs', price: 320, desc: 'Charcoal grilled leg quarter with hot spices' },
    { name: 'Reshmi Kabab', cat: 'bbq-kababs', price: 900, desc: 'Silky smooth chicken mince skewers' },

    // Handi
    { name: 'Mutton White Handi', cat: 'karahi-handi', price: 1800, desc: 'Earthen pot luxury mutton with mild cream' }
  ]
};

const runSeeder = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to Texas Grill Atlas: ${conn.connection.name}`);

    // Clear existing
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared state for full menu re-population...');

    // Save Categories
    const createdCats = await Category.insertMany(fullData.categories);
    console.log(`Created ${createdCats.length} Categories.`);

    // Map Categories
    const catMap = {};
    createdCats.forEach(c => {
      catMap[c.slug] = c._id;
    });

    // Save Items
    const finalItems = fullData.items.map(item => ({
      name: item.name,
      category: catMap[item.cat],
      price: item.price,
      description: item.desc,
      image: {
        url: `https://nexus.theforage.com/api/v1/asset-link?id=texas_${item.name.toLowerCase().replace(/ /g, '_')}`,
        publicId: 'seed'
      },
      isAvailable: true
    }));

    const result = await MenuItem.insertMany(finalItems);
    console.log(`Successfully injected ${result.length} Menu Items into Atlas.`);

    process.exit();
  } catch (err) {
    console.error(`Seeder Error: ${err.message}`);
    process.exit(1);
  }
};

runSeeder();
