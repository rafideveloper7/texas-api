const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: String,
  image: {
    url: String,
    publicId: String
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

<<<<<<< HEAD
module.exports = mongoose.model('Category', categorySchema);
=======
module.exports = mongoose.model('Category', categorySchema);
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
