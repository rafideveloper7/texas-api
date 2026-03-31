const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' }
}, { timestamps: true });

<<<<<<< HEAD
module.exports = mongoose.model('Contact', contactSchema);
=======
module.exports = mongoose.model('Contact', contactSchema);
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
