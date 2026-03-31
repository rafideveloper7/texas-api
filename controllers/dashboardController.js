const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
<<<<<<< HEAD
const Contact = require('../models/Contact');
=======
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97

exports.getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMenuItems = await MenuItem.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const todayReservations = await Reservation.countDocuments({ 
        date: { $gte: new Date().setHours(0,0,0,0), $lt: new Date().setHours(23,59,59,999) } 
    });
<<<<<<< HEAD
    const unreadContacts = await Contact.countDocuments({ status: 'unread' });
=======
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        totalUsers,
        totalMenuItems,
        pendingOrders,
<<<<<<< HEAD
        todayReservations,
        unreadContacts
=======
        todayReservations
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
