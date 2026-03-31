const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database and seed Admin
connectDB().then(async () => {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const adminEmail = 'admin@texasgrill.com';
    const adminPassword = 'Admin@123';

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: 'Master Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '1234567890',
        role: 'admin',
        address: {
          street: 'Kohat Base',
          city: 'Kohat',
          area: 'HQ'
        }
      });
      console.log('✅ [SEEDER] Admin user created: ' + adminEmail);
    } else {
      console.log('ℹ️ [SEEDER] Admin user already exists: ' + adminEmail);
    }
  } catch (err) {
    console.error('❌ [SEEDER] Error during admin seeding:', err.message);
  }
});

const app = express();

// Middleware
// app.use(helmet());
app.use(cors({
  origin: '*',
  // credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Texas API is running',
    health: '/api/health',
    version: '1.0.0'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/slider', require('./routes/sliderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// const PORT_VAL = 5001; 
// app.listen(PORT_VAL, '0.0.0.0', () => {
//   console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT_VAL}`);
// });
module.exports = app;

// Check required environment variables
if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined');
  // Don't crash, but log clearly
}