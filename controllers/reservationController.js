const Reservation = require('../models/Reservation');
<<<<<<< HEAD
const { sendReservationEmail } = require('../config/email');
=======
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97

exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
<<<<<<< HEAD
    
    // Send email notification
    await sendReservationEmail(reservation);
    
=======
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ 'customer.email': req.user.email }).sort('-date');
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort('-date');
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
    res.json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
    
    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ success: true, message: 'Reservation cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { date, time } = req.query;
    const reservations = await Reservation.find({ date, time, status: 'confirmed' });
    
<<<<<<< HEAD
=======
    // Logic for availability check (example: max 10 tables)
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
    const available = reservations.length < 10;
    
    res.json({ success: true, available });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
