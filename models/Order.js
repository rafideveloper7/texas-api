const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const orderSchema = new Schema({
  orderNumber: { type: String, unique: true },
  user: { type: ObjectId, ref: 'User' },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: String
  },
  items: [{
    menuItem: { type: ObjectId, ref: 'MenuItem' },
    name: String,
    price: Number,
    quantity: Number,
    customization: {
      size: String,
      spiceLevel: String,
      addOns: [String]
    }
  }],
  orderType: { type: String, enum: ['delivery', 'takeaway', 'dine-in'], default: 'delivery' },
  deliveryFee: { type: Number, default: 150 },
  subtotal: Number,
  discount: { type: Number, default: 0 },
  total: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cod', 'card', 'bank_transfer'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  specialInstructions: String,
  estimatedTime: Number
}, { timestamps: true });

<<<<<<< HEAD
module.exports = mongoose.model('Order', orderSchema);
=======
module.exports = mongoose.model('Order', orderSchema);
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
