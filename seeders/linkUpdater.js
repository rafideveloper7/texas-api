const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const links = [
  'http://karachidarbargroup.com/recipe/chicken-tikka-biryani/',
  'https://tiffinandteaofficial.com/chicken-tikka-biryani-restaurant-style/',
  'https://masala.tv/tikka-koyla-karahi-recipe/',
  'https://www.youtube.com/watch?v=2olxrbd6oHY',
  'https://www.foodpanda.pk/city/lahore/cuisine/burgers?srsltid=AfmBOorzNooC0EDsxiSY_-0PCy0wrfvB2Xk7DFL04LIqheKRGOTFhVba',
  'https://tiamoboise.com/italian-restaurants-in-idaho-falls-id/'
];

const updateLinks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const items = await MenuItem.find({}).select('_id');
    
    console.log(`Processing ${items.length} items...`);

    const bulkOps = items.map(item => {
      const randomLink = links[Math.floor(Math.random() * links.length)];
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { recipeLink: randomLink } }
        }
      };
    });

    const result = await MenuItem.bulkWrite(bulkOps);
    console.log(`Success! Updated ${result.modifiedCount} items with random links.`);
    
    process.exit();         
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateLinks();
