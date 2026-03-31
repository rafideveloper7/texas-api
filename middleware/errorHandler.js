const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

<<<<<<< HEAD
  console.log(err);

=======
  // Log error for dev
  console.log(err);

  // Mongoose bad ObjectId
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { status: 404, message };
  }

<<<<<<< HEAD
=======
  // Mongoose duplicate key
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { status: 400, message };
  }

<<<<<<< HEAD
=======
  // Mongoose validation error
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { status: 400, message };
  }

<<<<<<< HEAD
=======
  // JWT errors
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { status: 401, message };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { status: 401, message };
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
};

<<<<<<< HEAD
module.exports = errorHandler;
=======
module.exports = errorHandler;
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
