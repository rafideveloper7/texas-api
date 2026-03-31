const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    area: String
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  orders: [{ type: ObjectId, ref: 'Order' }],
  createdAt: { type: Date, default: Date.now }
});

<<<<<<< HEAD
module.exports = mongoose.model('User', userSchema);
=======
module.exports = mongoose.model('User', userSchema);
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
