const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Reservation = require('../models/Reservation');

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

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        totalUsers,
        totalMenuItems,
        pendingOrders,
        todayReservations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
