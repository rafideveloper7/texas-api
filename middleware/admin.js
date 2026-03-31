const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};

<<<<<<< HEAD
module.exports = adminMiddleware;
=======
module.exports = adminMiddleware;
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
