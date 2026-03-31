const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const menuItemSchema = new Schema({
  name: { type: String, required: true },
  category: { type: ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true, min: 0 },
  description: String,
  image: {
    url: String,
    publicId: String
  },
  isPopular: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  customization: {
    sizes: [{ name: String, price: Number, multiplier: Number }],
    spiceLevels: [String],
    addOns: [{ name: String, price: Number }]
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  recipeLink: String
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);