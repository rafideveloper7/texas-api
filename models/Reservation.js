const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservationSchema = new Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    guests: Number
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 120 },
  tableType: { type: String, enum: ['regular', 'family', 'private'], default: 'regular' },
  specialRequests: String,
  occasion: { type: String, enum: ['regular', 'birthday', 'anniversary', 'corporate'], default: 'regular' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' }
}, { timestamps: true });

<<<<<<< HEAD
module.exports = mongoose.model('Reservation', reservationSchema);
=======
module.exports = mongoose.model('Reservation', reservationSchema);
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
