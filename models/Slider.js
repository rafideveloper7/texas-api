const mongoose = require('mongoose');
const { Schema } = mongoose;

const sliderSchema = new Schema({
  title: { type: String, required: true },
  subtitle: String,
  image: {
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  },
  ctaText: String,
  ctaLink: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Slider', sliderSchema);
