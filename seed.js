const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const MONGODB_URI = "mongodb+srv://sms:sms@sms.ixn50pd.mongodb.net/texas-grill?retryWrites=true&w=majority&appName=sms";

const categoryMap = {
  'Rice': '69c8fc9916990b857678749c',
  'Ice Cream': '69c927dd16990b85767874da',
  'Salad': '69c927dd16990b85767874db',
  'Lassi & Desserts': '69c8fc9916990b85767874a1',
  'Fresh Shakes': '69c8fc9916990b85767874a1',
  'Fresh Juices': '69c8fc9916990b85767874a0',
  'Breakfast': '69c927dd16990b85767874dc',
  'Cold Drinks': '69c8fc9916990b85767874a0',
  'Burgers': '69c8fc9916990b857678749e',
  'Broast': '69c927dd16990b85767874dd',
  'Sandwiches': '69c927dd16990b85767874de',
  'Shawarma/Rolls': '69c927dd16990b85767874df',
  'French Fries/Finger Fish': '69c927dd16990b85767874e0',
  'Wings/Tortilla Wraps': '69c927dd16990b85767874e0',
  'Beverages': '69c8fc9916990b85767874a0',
  'Pizza': '69c8fc9916990b857678749b',
  'Special Dishes': '69c8fc9916990b8576787498',
  'Karahi': '69c8fc9916990b857678749a',
  'B.B.Q': '69c8fc9916990b8576787499',
  'Handi': '69c8fc9916990b857678749a'
};

const items = [
  { name: "Kabli Pulao", category: "Rice", price: 450, description: "Traditional Afghan-style rice cooked with tender mutton, carrots, raisins, and aromatic spices." },
  { name: "Karachi Biryani", category: "Rice", price: 380, description: "Spicy and flavorful biryani made with chicken, basmati rice, and Karachi-style masala." },
  { name: "Champ Roash", category: "Rice", price: 520, description: "Juicy mutton chops cooked to perfection and served with steamed rice. A Kohat specialty." },
  { name: "Qeema", category: "Rice", price: 320, description: "Finely minced beef cooked with peas and traditional spices." },
  { name: "Chicken Korma", category: "Rice", price: 350, description: "Creamy and rich chicken curry cooked in yogurt-based gravy." },
  { name: "Daal Channa", category: "Rice", price: 220, description: "Protein-rich black chickpeas slow-cooked with ginger and garlic." },
  { name: "Sabzi", category: "Rice", price: 200, description: "Seasonal mixed vegetables cooked with light spices." },
  { name: "Pista Ice Cream", category: "Ice Cream", price: 80, description: "Creamy pistachio-flavored ice cream made with real pistachios." },
  { name: "Kolfa Ice Cream", category: "Ice Cream", price: 80, description: "Traditional kulfi-style ice cream with rich malai flavor." },
  { name: "Blue Berry Ice Cream", category: "Ice Cream", price: 80, description: "Refreshing blueberry-flavored ice cream with a fruity twist." },
  { name: "Chocolate Ice Cream", category: "Ice Cream", price: 80, description: "Rich and creamy chocolate ice cream made with premium cocoa." },
  { name: "Strawberry Ice Cream", category: "Ice Cream", price: 80, description: "Sweet and tangy strawberry ice cream with real fruit flavor." },
  { name: "Vanilla Ice Cream", category: "Ice Cream", price: 80, description: "Classic vanilla bean ice cream smooth and creamy." },
  { name: "Bounty Ice Cream", category: "Ice Cream", price: 80, description: "Coconut and chocolate combination ice cream." },
  { name: "Mango Ice Cream", category: "Ice Cream", price: 80, description: "Fresh mango-flavored ice cream capturing the essence of Pakistani mangoes." },
  { name: "Extra Topping", category: "Ice Cream", price: 50, description: "Add extra chocolate sauce, nuts, or sprinkles." },
  { name: "Russian Salad", category: "Salad", price: 350, description: "Creamy salad with boiled vegetables, apples, and mayonnaise dressing." },
  { name: "Fresh Vegetable Salad", category: "Salad", price: 80, description: "Fresh cucumber, tomato, onion, and carrot with lemon." },
  { name: "Fresh Raita", category: "Salad", price: 80, description: "Yogurt mixed with cucumber, mint, and roasted cumin powder." },
  { name: "Fruit Punch", category: "Salad", price: 400, description: "Fresh seasonal fruits tossed in a tangy dressing." },
  { name: "Fruit Special Chat", category: "Salad", price: 350, description: "Mixed fruits with chaat masala, tamarind sauce, and crispy papri." },
  { name: "Special Ice Cream Shake", category: "Lassi & Desserts", price: 300, description: "Thick shake made with vanilla ice cream and milk." },
  { name: "Special Kit Kat Shake", category: "Lassi & Desserts", price: 350, description: "Crushed Kit Kat blended with ice cream and milk." },
  { name: "Special Snickers Shake", category: "Lassi & Desserts", price: 350, description: "Caramel peanut chocolate shake with Snickers bar." },
  { name: "Special Mars Shake", category: "Lassi & Desserts", price: 350, description: "Caramel chocolate malt shake with Mars bar." },
  { name: "Special Oreo Shake", category: "Lassi & Desserts", price: 350, description: "Crushed Oreo cookies blended with vanilla ice cream." },
  { name: "Special Bounty Shake", category: "Lassi & Desserts", price: 350, description: "Coconut chocolate shake with Bounty bar." },
  { name: "Special Protein Shake", category: "Lassi & Desserts", price: 350, description: "High-protein shake with whey protein and banana." },
  { name: "Special Fresh Fruit Shake", category: "Lassi & Desserts", price: 200, description: "Fresh seasonal fruits blended with milk." },
  { name: "Apple Fresh Shake", category: "Fresh Shakes", price: 250, description: "Fresh apple blended with chilled milk and cinnamon." },
  { name: "Mango Fresh Shake", category: "Fresh Shakes", price: 250, description: "Ripe seasonal mangoes blended with milk." },
  { name: "Banana Fresh Shake", category: "Fresh Shakes", price: 250, description: "Ripe bananas blended with milk and honey." },
  { name: "Peach Fresh Shake", category: "Fresh Shakes", price: 300, description: "Sweet peach puree blended with yogurt and milk." },
  { name: "Papaya Fresh Shake", category: "Fresh Shakes", price: 300, description: "Fresh papaya blended with milk and honey." },
  { name: "Strawberry Fresh Shake", category: "Fresh Shakes", price: 300, description: "Fresh strawberries blended with milk and sugar." },
  { name: "Fresh lime Juice", category: "Fresh Juices", price: 250, description: "Freshly squeezed lime with sugar and salt." },
  { name: "Mint Lemonade", category: "Fresh Juices", price: 250, description: "Fresh mint leaves blended with lime juice." },
  { name: "Pomegranate Juice", category: "Fresh Juices", price: 400, description: "Freshly pressed pomegranate seeds." },
  { name: "Carrot Juice", category: "Fresh Juices", price: 200, description: "Fresh carrot juice with a hint of ginger." },
  { name: "Apple Juice", category: "Fresh Juices", price: 250, description: "Fresh apple juice without added sugar." },
  { name: "Orange Juice", category: "Fresh Juices", price: 250, description: "Freshly squeezed oranges. Vitamin C rich." },
  { name: "Plum Juice", category: "Fresh Juices", price: 250, description: "Sweet and tangy alu bukhara juice." },
  { name: "Falsa Juice", category: "Fresh Juices", price: 300, description: "Seasonal falsa berry juice with black salt." },
  { name: "Mango Lassi", category: "Fresh Juices", price: 200, description: "Sweet mango pulp blended with thick yogurt." },
  { name: "Plain Lassi", category: "Fresh Juices", price: 150, description: "Traditional yogurt drink blended with sugar or salt." },
  { name: "Lemon Water", category: "Fresh Juices", price: 200, description: "Fresh lemon juice with sugar and water." },
  { name: "Plain Paratha", category: "Breakfast", price: 60, description: "Layered flatbread fried to golden perfection." },
  { name: "Tandoori Paratha", category: "Breakfast", price: 80, description: "Whole wheat flatbread baked in tandoor." },
  { name: "Omelette", category: "Breakfast", price: 120, description: "Three-egg omelette with onions, tomatoes and chilies." },
  { name: "Gur Tea", category: "Breakfast", price: 100, description: "Black tea sweetened with jaggery. Traditional Kohat drink." },
  { name: "Malai", category: "Breakfast", price: 100, description: "Fresh thick cream served with bread or paratha." },
  { name: "Doodh Pati Chai", category: "Breakfast", price: 70, description: "Strong milk tea without water." },
  { name: "Green Tea", category: "Breakfast", price: 50, description: "Light and healthy green tea." },
  { name: "Egg Fry", category: "Breakfast", price: 60, description: "Sunny side up egg fried in butter." },
  { name: "Coffee", category: "Breakfast", price: 150, description: "Freshly brewed coffee with milk and sugar." },
  { name: "Kashmiri Chai", category: "Breakfast", price: 150, description: "Pink tea with nuts and cardamom." },
  { name: "Plain Naan", category: "Breakfast", price: 40, description: "Soft tandoor-baked flatbread." },
  { name: "Chapati", category: "Breakfast", price: 80, description: "Whole wheat hand-made flatbread." },
  { name: "Cold Drink Regular", category: "Cold Drinks", price: 70, description: "Regular sized soft drink. Pepsi, Coca-Cola, or 7Up." },
  { name: "Cold Drink 1 Liter", category: "Cold Drinks", price: 170, description: "One liter bottle. Perfect for sharing." },
  { name: "Cold Drink 1.5 Liter", category: "Cold Drinks", price: 220, description: "Large bottle for family or group." },
  { name: "Cold Drink Jumbo", category: "Cold Drinks", price: 300, description: "Extra large bottle for parties." },
  { name: "Sting Regular", category: "Cold Drinks", price: 80, description: "Carbonated energy drink with caffeine." },
  { name: "Sting Disposable", category: "Cold Drinks", price: 130, description: "Larger disposable bottle of Sting." },
  { name: "Soft Drink Can", category: "Cold Drinks", price: 130, description: "Chilled canned soft drink." },
  { name: "Zinger Burger", category: "Burgers", price: 480, description: "Crispy fried chicken fillet with lettuce and mayo." },
  { name: "Zinger Cheese Burger", category: "Burgers", price: 520, description: "Crispy zinger fillet with melted cheese and lettuce." },
  { name: "Zinger Double Cheese Burger", category: "Burgers", price: 570, description: "Double zinger fillet with double cheese." },
  { name: "Beef Burger", category: "Burgers", price: 480, description: "Grilled beef patty with lettuce and tomato." },
  { name: "Beef Cheese Burger", category: "Burgers", price: 520, description: "Juicy beef patty with melted cheese." },
  { name: "Chicken Grill Burger", category: "Burgers", price: 650, description: "Grilled chicken breast marinated in herbs." },
  { name: "Chicken Grill Cheese Burger", category: "Burgers", price: 700, description: "Grilled chicken with melted cheese and garlic mayo." },
  { name: "Peri Peri Burger", category: "Burgers", price: 480, description: "Spicy peri peri chicken fillet with lettuce." },
  { name: "Fish Zinger Burger", category: "Burgers", price: 620, description: "Crispy fried fish fillet with tartar sauce." },
  { name: "Fish Zinger Cheese Burger", category: "Burgers", price: 680, description: "Fish fillet with melted cheese and creamy sauce." },
  { name: "Quarter Broast", category: "Broast", price: 550, description: "One piece of crispy fried chicken with fries." },
  { name: "Garlic Broast", category: "Broast", price: 580, description: "Crispy broast chicken tossed in garlic butter." },
  { name: "Cheese Broast", category: "Broast", price: 600, description: "Broast chicken topped with melted cheese." },
  { name: "Masala Broast", category: "Broast", price: 550, description: "Crispy chicken coated with spicy masala." },
  { name: "Full Broast", category: "Broast", price: 2100, description: "Whole chicken broast with fries and coleslaw." },
  { name: "Club Sandwich", category: "Sandwiches", price: 480, description: "Triple-layer sandwich with chicken and mayo." },
  { name: "Club Cheese Sandwich", category: "Sandwiches", price: 520, description: "Club sandwich with extra cheese." },
  { name: "BBQ Sandwich", category: "Sandwiches", price: 550, description: "Grilled BBQ chicken with caramelized onions." },
  { name: "BBQ Cheese Sandwich", category: "Sandwiches", price: 590, description: "BBQ chicken sandwich with melted cheddar." },
  { name: "Tikka Sandwich", category: "Sandwiches", price: 550, description: "Chicken tikka pieces with mint chutney." },
  { name: "Tikka Cheese Sandwich", category: "Sandwiches", price: 580, description: "Chicken tikka with melted cheese." },
  { name: "Crispy Chicken Sandwich", category: "Sandwiches", price: 480, description: "Crispy fried chicken fillet with lettuce." },
  { name: "Crispy Chicken Cheese Sandwich", category: "Sandwiches", price: 530, description: "Crispy chicken with cheese and creamy sauce." },
  { name: "Chicken Shawarma", category: "Shawarma/Rolls", price: 250, description: "Grilled chicken wrapped in pita with garlic sauce." },
  { name: "Chicken Cheese Shawarma", category: "Shawarma/Rolls", price: 300, description: "Chicken shawarma with melted cheese." },
  { name: "Zinger Shawarma", category: "Shawarma/Rolls", price: 300, description: "Crispy zinger fillet wrapped with fresh veggies." },
  { name: "Zinger Cheese Shawarma", category: "Shawarma/Rolls", price: 320, description: "Zinger shawarma with melted cheese." },
  { name: "Zinger Paratha Roll", category: "Shawarma/Rolls", price: 300, description: "Crispy zinger wrapped in soft paratha." },
  { name: "Zinger Cheese Paratha Roll", category: "Shawarma/Rolls", price: 330, description: "Zinger roll with cheese in flaky paratha." },
  { name: "Chicken Paratha Roll", category: "Shawarma/Rolls", price: 300, description: "Grilled chicken pieces wrapped in paratha." },
  { name: "Chicken Cheese Paratha Roll", category: "Shawarma/Rolls", price: 320, description: "Chicken roll with melted cheese and spicy sauce." },
  { name: "Loaded Fries", category: "French Fries/Finger Fish", price: 700, description: "Crispy fries topped with cheese sauce and chicken." },
  { name: "Mayo Garlic Fries", category: "French Fries/Finger Fish", price: 330, description: "Fresh fries tossed in garlic mayo." },
  { name: "Masala Fries", category: "French Fries/Finger Fish", price: 300, description: "Crispy fries sprinkled with chaat masala." },
  { name: "Plain Fries", category: "French Fries/Finger Fish", price: 280, description: "Classic crispy french fries." },
  { name: "Thousand Island Fries", category: "French Fries/Finger Fish", price: 350, description: "Fries topped with thousand island sauce." },
  { name: "Finger Fish 4 Pcs", category: "French Fries/Finger Fish", price: 650, description: "Crispy fish fingers served with tartar sauce." },
  { name: "Finger Fish 12 Pcs", category: "French Fries/Finger Fish", price: 1800, description: "Family portion of crispy fish fingers." },
  { name: "Koila BBQ Wings", category: "Wings/Tortilla Wraps", price: 450, description: "Charcoal-grilled wings with smoky BBQ flavor." },
  { name: "BBQ Wings", category: "Wings/Tortilla Wraps", price: 450, description: "Grilled chicken wings basted in tangy BBQ sauce." },
  { name: "Buffalo Wings", category: "Wings/Tortilla Wraps", price: 500, description: "Spicy buffalo sauce coated wings." },
  { name: "Hot Wings", category: "Wings/Tortilla Wraps", price: 450, description: "Extra spicy hot wings for heat lovers." },
  { name: "Tender Juicy Chicken", category: "Wings/Tortilla Wraps", price: 600, description: "Crispy chicken tenders served with fries." },
  { name: "Beef Jumbo Wrap", category: "Wings/Tortilla Wraps", price: 499, description: "Large tortilla wrap with grilled beef." },
  { name: "Chicken Jumbo Wrap", category: "Wings/Tortilla Wraps", price: 449, description: "Large wrap with grilled chicken and lettuce." },
  { name: "Hot Dog Wrap", category: "Wings/Tortilla Wraps", price: 449, description: "Tortilla wrapped around beef sausage with cheese." },
  { name: "Mint Margarita", category: "Beverages", price: 250, description: "Refreshing mint lemonade with crushed ice." },
  { name: "Texas Special Deep Dish Pizza", category: "Pizza", price: 1160, description: "Deep dish pizza with special red sauce and extra cheese." },
  { name: "Dam Pukh With Rice", category: "Special Dishes", price: 1800, description: "Slow-cooked meat and rice sealed in handi." },
  { name: "Shinwari Mutton Karahi", category: "Karahi", price: 1600, description: "Traditional Shinwari-style mutton karahi." },
  { name: "Mutton Tikka Champ", category: "B.B.Q", price: 1550, description: "Tender mutton chops marinated in spices." },
  { name: "Mutton White Handi", category: "Handi", price: 1800, description: "Mutton cooked in creamy white gravy." }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas");
    
    // Clear list to avoid duplicates
    await MenuItem.deleteMany({});
    console.log("Cleared existing items");

    const documents = items.map(item => ({
      ...item,
      category: categoryMap[item.category] || null,
      image: { url: "https://images.unsplash.com/photo-1544025162-d76694265947", publicId: "none" },
      isAvailable: true,
      isPopular: item.price > 1200
    }));

    await MenuItem.insertMany(documents);
    console.log(`Successfully seeded ${documents.length} items.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
