// setup.js - Run this file to create the complete backend structure
const fs = require('fs');
const path = require('path');

// Create directory structure
const directories = [
  'config',
  'controllers',
  'middleware',
  'models',
  'routes',
  'utils',
  'seeders'
];

// Create all directories
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${dir}/`);
  }
});

// ==================== ROOT FILES ====================

// .env file
const envContent = `# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://sms:sms@sms.ixn50pd.mongodb.net/texas_grill?retryWrites=true&w=majority&appName=sms

# JWT Secret
JWT_SECRET=iamrfiullah
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dkcktxpnf
CLOUDINARY_API_KEY=665554528579647
CLOUDINARY_API_SECRET=vy2fygNYcMAeZNC5iP7oxfRpHso

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Default Credentials
ADMIN_EMAIL=admin@texasgrill.com
ADMIN_PASSWORD=Admin@123

# Email Configuration for FormSubmit
FORMSUBMIT_EMAIL=your-email@example.com
`;
fs.writeFileSync('.env', envContent);
console.log('✅ Created: .env');

// .gitignore
const gitignoreContent = `node_modules/
.env
.DS_Store
*.log
dist/
build/
.vercel
`;
fs.writeFileSync('.gitignore', gitignoreContent);
console.log('✅ Created: .gitignore');

// vercel.json
const vercelContent = `{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}`;
fs.writeFileSync('vercel.json', vercelContent);
console.log('✅ Created: vercel.json');

// package.json
const packageContent = `{
  "name": "texas-grill-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seeders/initialData.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.41.0",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}`;
fs.writeFileSync('package.json', packageContent);
console.log('✅ Created: package.json');

// server.js
const serverContent = `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Texas Grill API is running',
    health: '/api/health',
    version: '1.0.0'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'OK', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running in \${process.env.NODE_ENV || 'development'} mode on port \${PORT}\`);
});

module.exports = app;`;
fs.writeFileSync('server.js', serverContent);
console.log('✅ Created: server.js');

// ==================== CONFIG FILES ====================

// config/database.js
const databaseContent = `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(\`✅ MongoDB Connected: \${conn.connection.host}\`);
    
    // Seed admin user after connection
    await seedAdmin();
    
    return conn;
  } catch (error) {
    console.error(\`❌ MongoDB Error: \${error.message}\`);
    // Don't exit, just log for serverless
  }
};

const seedAdmin = async () => {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.log('⚠️ Admin credentials not set in environment');
      return;
    }
    
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
          street: 'Main Branch',
          city: 'Kohat',
          area: 'HQ'
        }
      });
      console.log(\`✅ Admin user created: \${adminEmail}\`);
    } else {
      console.log(\`ℹ️ Admin user already exists: \${adminEmail}\`);
    }
  } catch (err) {
    console.error('❌ Admin seeding error:', err.message);
  }
};

module.exports = connectDB;`;
fs.writeFileSync('config/database.js', databaseContent);
console.log('✅ Created: config/database.js');

// config/cloudinary.js
const cloudinaryContent = `const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (fileBuffer, folder = 'texas_grill') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary };`;
fs.writeFileSync('config/cloudinary.js', cloudinaryContent);
console.log('✅ Created: config/cloudinary.js');

// config/multer.js
const multerContent = `const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

module.exports = upload;`;
fs.writeFileSync('config/multer.js', multerContent);
console.log('✅ Created: config/multer.js');

// config/email.js
const emailContent = `const nodemailer = require('nodemailer');

// FormSubmit compatible email sender
const sendEmail = async (to, subject, html, fromName = 'Texas Grill') => {
  try {
    // For FormSubmit, we'll use their API structure
    // This sends email to the configured email address
    
    const formSubmitEmail = process.env.FORMSUBMIT_EMAIL;
    
    if (!formSubmitEmail) {
      console.log('⚠️ FORMSUBMIT_EMAIL not configured');
      return { success: false, message: 'Email not configured' };
    }
    
    // Using fetch to FormSubmit API
    const response = await fetch('https://formsubmit.co/ajax/' + formSubmitEmail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: to,
        subject: subject,
        message: html,
        _template: 'table',
        _captcha: 'false'
      })
    });
    
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, message: error.message };
  }
};

const sendOrderEmail = async (orderData) => {
  const subject = \`New Order #\${orderData.orderNumber}\`;
  const html = \`
    <h2>New Order Received!</h2>
    <p><strong>Order Number:</strong> \${orderData.orderNumber}</p>
    <p><strong>Customer:</strong> \${orderData.customer.name}</p>
    <p><strong>Phone:</strong> \${orderData.customer.phone}</p>
    <p><strong>Address:</strong> \${orderData.customer.address || 'N/A'}</p>
    <p><strong>Order Type:</strong> \${orderData.orderType}</p>
    <p><strong>Total Amount:</strong> PKR \${orderData.total}</p>
    <p><strong>Payment Method:</strong> \${orderData.paymentMethod}</p>
    <h3>Items:</h3>
    <ul>
      \${orderData.items.map(item => \`<li>\${item.quantity}x \${item.name} - PKR \${item.price * item.quantity}</li>\`).join('')}
    </ul>
    <p><strong>Special Instructions:</strong> \${orderData.specialInstructions || 'None'}</p>
  \`;
  
  return await sendEmail(process.env.FORMSUBMIT_EMAIL, subject, html);
};

const sendContactEmail = async (contactData) => {
  const subject = \`New Contact Message: \${contactData.subject || 'No Subject'}\`;
  const html = \`
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> \${contactData.name}</p>
    <p><strong>Email:</strong> \${contactData.email}</p>
    <p><strong>Phone:</strong> \${contactData.phone || 'N/A'}</p>
    <p><strong>Subject:</strong> \${contactData.subject || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>\${contactData.message}</p>
  \`;
  
  return await sendEmail(process.env.FORMSUBMIT_EMAIL, subject, html);
};

const sendReservationEmail = async (reservationData) => {
  const subject = \`New Reservation Request\`;
  const html = \`
    <h2>New Table Reservation</h2>
    <p><strong>Customer:</strong> \${reservationData.customer.name}</p>
    <p><strong>Phone:</strong> \${reservationData.customer.phone}</p>
    <p><strong>Email:</strong> \${reservationData.customer.email || 'N/A'}</p>
    <p><strong>Date:</strong> \${new Date(reservationData.date).toLocaleDateString()}</p>
    <p><strong>Time:</strong> \${reservationData.time}</p>
    <p><strong>Guests:</strong> \${reservationData.customer.guests}</p>
    <p><strong>Table Type:</strong> \${reservationData.tableType}</p>
    <p><strong>Occasion:</strong> \${reservationData.occasion}</p>
    <p><strong>Special Requests:</strong> \${reservationData.specialRequests || 'None'}</p>
  \`;
  
  return await sendEmail(process.env.FORMSUBMIT_EMAIL, subject, html);
};

module.exports = { sendEmail, sendOrderEmail, sendContactEmail, sendReservationEmail };`;
fs.writeFileSync('config/email.js', emailContent);
console.log('✅ Created: config/email.js');

// ==================== MODELS ====================

// models/User.js
const userModelContent = `const mongoose = require('mongoose');
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

module.exports = mongoose.model('User', userSchema);`;
fs.writeFileSync('models/User.js', userModelContent);
console.log('✅ Created: models/User.js');

// models/Category.js
const categoryModelContent = `const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: String,
  image: {
    url: String,
    publicId: String
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);`;
fs.writeFileSync('models/Category.js', categoryModelContent);
console.log('✅ Created: models/Category.js');

// models/MenuItem.js
const menuItemModelContent = `const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const menuItemSchema = new Schema({
  name: { type: String, required: true },
  category: { type: ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true, min: 0 },
  description: String,
  image: {
    url: String,
    publicId: String
  },
  isPopular: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  customization: {
    sizes: [{ name: String, price: Number, multiplier: Number }],
    spiceLevels: [String],
    addOns: [{ name: String, price: Number }]
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  recipeLink: String
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);`;
fs.writeFileSync('models/MenuItem.js', menuItemModelContent);
console.log('✅ Created: models/MenuItem.js');

// models/Order.js
const orderModelContent = `const mongoose = require('mongoose');
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

module.exports = mongoose.model('Order', orderSchema);`;
fs.writeFileSync('models/Order.js', orderModelContent);
console.log('✅ Created: models/Order.js');

// models/Reservation.js
const reservationModelContent = `const mongoose = require('mongoose');
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

module.exports = mongoose.model('Reservation', reservationSchema);`;
fs.writeFileSync('models/Reservation.js', reservationModelContent);
console.log('✅ Created: models/Reservation.js');

// models/Contact.js
const contactModelContent = `const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);`;
fs.writeFileSync('models/Contact.js', contactModelContent);
console.log('✅ Created: models/Contact.js');

// ==================== UTILS ====================

// utils/generateOrderNumber.js
const generateOrderContent = `const generateOrderNumber = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TG-';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports = generateOrderNumber;`;
fs.writeFileSync('utils/generateOrderNumber.js', generateOrderContent);
console.log('✅ Created: utils/generateOrderNumber.js');

// ==================== MIDDLEWARE ====================

// middleware/auth.js
const authMiddlewareContent = `const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized: ' + error.message });
  }
};

module.exports = authMiddleware;`;
fs.writeFileSync('middleware/auth.js', authMiddlewareContent);
console.log('✅ Created: middleware/auth.js');

// middleware/admin.js
const adminMiddlewareContent = `const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};

module.exports = adminMiddleware;`;
fs.writeFileSync('middleware/admin.js', adminMiddlewareContent);
console.log('✅ Created: middleware/admin.js');

// middleware/errorHandler.js
const errorHandlerContent = `const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err);

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { status: 404, message };
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { status: 400, message };
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { status: 400, message };
  }

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

module.exports = errorHandler;`;
fs.writeFileSync('middleware/errorHandler.js', errorHandlerContent);
console.log('✅ Created: middleware/errorHandler.js');

// ==================== CONTROLLERS ====================

// controllers/authController.js
const authControllerContent = `const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`;
fs.writeFileSync('controllers/authController.js', authControllerContent);
console.log('✅ Created: controllers/authController.js');

// controllers/categoryController.js
const categoryControllerContent = `const Category = require('../models/Category');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.getCategories = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort('order');
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, order, isActive } = req.body;
    let imageData = null;
    if (req.file) {
      imageData = await uploadToCloudinary(req.file.buffer, 'categories');
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\\w-]+/g, '');

    const category = await Category.create({
      name,
      slug,
      description,
      image: imageData,
      isActive: isActive === 'true',
      order: Number(order) || 0
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    let updateData = { name, description, isActive: isActive === 'true' };
    
    if (req.file) {
      const imageData = await uploadToCloudinary(req.file.buffer, 'categories');
      updateData.image = imageData;
    }
    
    if (name) {
      updateData.slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\\w-]+/g, '');
    }

    const category = await Category.findByIdAndUpdate(req.params.id, { $set: updateData }, {
      new: true,
      runValidators: true
    });

    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`;
fs.writeFileSync('controllers/categoryController.js', categoryControllerContent);
console.log('✅ Created: controllers/categoryController.js');

// controllers/menuController.js
const menuControllerContent = `const MenuItem = require('../models/MenuItem');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.getMenuItems = async (req, res) => {
  try {
    const { includeUnavailable } = req.query;
    const filter = includeUnavailable === 'true' ? {} : { isAvailable: true };
    const items = await MenuItem.find(filter).populate('category', 'name slug');
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name slug');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const items = await MenuItem.find({ category: req.params.categoryId, isAvailable: true });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPopularItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isPopular: true, isAvailable: true }).limit(8);
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    let imageData = null;
    if (req.file) {
      imageData = await uploadToCloudinary(req.file.buffer, 'menu-items');
    }

    const { name, category, price, description, isPopular, customization, nutritionalInfo } = req.body;
    
    const parsedCustomization = typeof customization === 'string' ? JSON.parse(customization) : customization;
    const parsedNutritionalInfo = typeof nutritionalInfo === 'string' ? JSON.parse(nutritionalInfo) : nutritionalInfo;

    const menuItem = await MenuItem.create({
      name,
      category,
      price,
      description,
      image: imageData,
      isPopular: isPopular === 'true' || isPopular === true,
      customization: parsedCustomization,
      nutritionalInfo: parsedNutritionalInfo
    });

    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, isPopular, customization, nutritionalInfo, isAvailable } = req.body;
    let updateData = { name, category, price, description, isPopular: isPopular === 'true', isAvailable: isAvailable === 'true' };
    
    if (req.file) {
      const imageData = await uploadToCloudinary(req.file.buffer, 'menu-items');
      updateData.image = imageData;
    }

    if (customization) {
      updateData.customization = typeof customization === 'string' ? JSON.parse(customization) : customization;
    }
    if (nutritionalInfo) {
      updateData.nutritionalInfo = typeof nutritionalInfo === 'string' ? JSON.parse(nutritionalInfo) : nutritionalInfo;
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, { $set: updateData }, {
      new: true,
      runValidators: true
    });

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    
    item.isAvailable = !item.isAvailable;
    await item.save();
    
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`;
fs.writeFileSync('controllers/menuController.js', menuControllerContent);
console.log('✅ Created: controllers/menuController.js');

// controllers/orderController.js
const orderControllerContent = `const Order = require('../models/Order');
const generateOrderNumber = require('../utils/generateOrderNumber');
const { sendOrderEmail } = require('../config/email');

exports.createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      orderNumber: generateOrderNumber(),
      user: req.user ? req.user.id : null
    };

    const order = await Order.create(orderData);
    
    // Send email notification
    await sendOrderEmail(order);
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    if (req.user.role !== 'admin' && order.user && order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort('-createdAt');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, 
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, 
      { paymentStatus: req.body.paymentStatus },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    if (order.user && order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`;
fs.writeFileSync('controllers/orderController.js', orderControllerContent);
console.log('✅ Created: controllers/orderController.js');

// controllers/reservationController.js
const reservationControllerContent = `const Reservation = require('../models/Reservation');
const { sendReservationEmail } = require('../config/email');

exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    
    // Send email notification
    await sendReservationEmail(reservation);
    
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
    
    const available = reservations.length < 10;
    
    res.json({ success: true, available });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`;
fs.writeFileSync('controllers/reservationController.js', reservationControllerContent);
console.log('✅ Created: controllers/reservationController.js');

// controllers/contactController.js
const contactControllerContent = `const Contact = require('../models/Contact');
const { sendContactEmail } = require('../config/email');

exports.submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    
    // Send email notification
    await sendContactEmail(contact);
    
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, 
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`;
fs.writeFileSync('controllers/contactController.js', contactControllerContent);
console.log('✅ Created: controllers/contactController.js');

// controllers/dashboardController.js
const dashboardControllerContent = `const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Contact = require('../models/Contact');

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
    const unreadContacts = await Contact.countDocuments({ status: 'unread' });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        totalUsers,
        totalMenuItems,
        pendingOrders,
        todayReservations,
        unreadContacts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`;
fs.writeFileSync('controllers/dashboardController.js', dashboardControllerContent);
console.log('✅ Created: controllers/dashboardController.js');

// ==================== ROUTES ====================

// routes/authRoutes.js
const authRoutesContent = `const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe, updateProfile, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', authMiddleware, getMe);
router.put('/update', authMiddleware, updateProfile);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;`;
fs.writeFileSync('routes/authRoutes.js', authRoutesContent);
console.log('✅ Created: routes/authRoutes.js');

// routes/categoryRoutes.js
const categoryRoutesContent = `const express = require('express');
const router = express.Router();
const { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const upload = require('../config/multer');

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createCategory);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;`;
fs.writeFileSync('routes/categoryRoutes.js', categoryRoutesContent);
console.log('✅ Created: routes/categoryRoutes.js');

// routes/menuRoutes.js
const menuRoutesContent = `const express = require('express');
const router = express.Router();
const { getMenuItems, getMenuItemById, getMenuItemsByCategory, getPopularItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = require('../controllers/menuController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const upload = require('../config/multer');

router.get('/', getMenuItems);
router.get('/popular', getPopularItems);
router.get('/:id', getMenuItemById);
router.get('/category/:categoryId', getMenuItemsByCategory);

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createMenuItem);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateMenuItem);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMenuItem);
router.put('/:id/availability', authMiddleware, adminMiddleware, toggleAvailability);

module.exports = router;`;
fs.writeFileSync('routes/menuRoutes.js', menuRoutesContent);
console.log('✅ Created: routes/menuRoutes.js');

// routes/orderRoutes.js
const orderRoutesContent = `const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, updatePaymentStatus, cancelOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', (req, res, next) => {
  if (req.headers.authorization) return authMiddleware(req, res, next);
  next();
}, createOrder);

router.get('/', authMiddleware, getUserOrders);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.put('/:id/payment', authMiddleware, adminMiddleware, updatePaymentStatus);
router.delete('/:id', authMiddleware, cancelOrder);

module.exports = router;`;
fs.writeFileSync('routes/orderRoutes.js', orderRoutesContent);
console.log('✅ Created: routes/orderRoutes.js');

// routes/reservationRoutes.js
const reservationRoutesContent = `const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, getAllReservations, updateReservation, cancelReservation, checkAvailability } = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', createReservation);
router.get('/availability', checkAvailability);
router.get('/', authMiddleware, getUserReservations);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllReservations);
router.put('/:id', authMiddleware, updateReservation);
router.delete('/:id', authMiddleware, cancelReservation);

module.exports = router;`;
fs.writeFileSync('routes/reservationRoutes.js', reservationRoutesContent);
console.log('✅ Created: routes/reservationRoutes.js');

// routes/contactRoutes.js
const contactRoutesContent = `const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContactStatus, deleteContact } = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post('/', submitContact);
router.get('/', authMiddleware, adminMiddleware, getContacts);
router.put('/:id/status', authMiddleware, adminMiddleware, updateContactStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

module.exports = router;`;
fs.writeFileSync('routes/contactRoutes.js', contactRoutesContent);
console.log('✅ Created: routes/contactRoutes.js');

// routes/dashboardRoutes.js
const dashboardRoutesContent = `const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/stats', authMiddleware, adminMiddleware, getStats);

module.exports = router;`;
fs.writeFileSync('routes/dashboardRoutes.js', dashboardRoutesContent);
console.log('✅ Created: routes/dashboardRoutes.js');

// ==================== SEEDERS ====================

// seeders/initialData.js
const seederContent = `const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const categories = [
  { name: 'Special Dishes', slug: 'special-dishes', description: 'Our chef\'s signature creations', order: 1 },
  { name: 'BBQ & Kababs', slug: 'bbq-kababs', description: 'Charcoal grilled perfection', order: 2 },
  { name: 'Karahi & Handi', slug: 'karahi-handi', description: 'Traditional clay pot delicacies', order: 3 },
  { name: 'Pizza & Fast Food', slug: 'pizza-fast-food', description: 'International favorites', order: 4 },
  { name: 'Rice & Biryani', slug: 'rice-biryani', description: 'Fragrant rice specialties', order: 5 },
  { name: 'Classic Curries', slug: 'classic-curries', description: 'Rich and creamy gravies', order: 6 },
  { name: 'Burgers', slug: 'burgers', description: 'Gourmet burgers and wraps', order: 7 },
  { name: 'Seafood', slug: 'seafood', description: 'Fresh catch of the day', order: 8 },
  { name: 'Beverages', slug: 'beverages', description: 'Refreshing drinks & shakes', order: 9 },
  { name: 'Desserts', slug: 'desserts', description: 'Sweet endings', order: 10 }
];

const menuItems = [
  { name: 'Dum Pukh', price: 2500, description: 'Traditional slow-cooked meat with authentic spices.', isPopular: true },
  { name: 'Arabian Live Mandi', price: 2800, description: 'Authentic Yemeni dish with specially spiced meat and rice.', isPopular: true },
  { name: 'Shinwari Mutton Karahi', price: 2400, description: 'Peshawari style mutton cooked with tomatoes.' },
  { name: 'Matka Pizza', price: 900, description: 'Our special cheesy pizza served in a Matka.', isPopular: true },
  { name: 'Special BBQ Platter', price: 3500, description: 'Massive assortment of BBQ items.', isPopular: true },
  { name: 'Crunchy Zinger Burger', price: 550, description: 'Crispy fried chicken breast.' },
  { name: 'Special Gur Tea', price: 150, description: 'Traditional milk tea with jaggery.' }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany();
    await MenuItem.deleteMany();
    console.log('Cleared existing data');

    const createdCategories = await Category.insertMany(categories);
    console.log(\`Added \${createdCategories.length} categories\`);

    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });

    const itemsWithCategories = menuItems.map(item => ({
      ...item,
      category: categoryMap['special dishes'] || createdCategories[0]._id
    }));

    await MenuItem.insertMany(itemsWithCategories);
    console.log(\`Added \${itemsWithCategories.length} menu items\`);

    console.log('✅ Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedData();`;
fs.writeFileSync('seeders/initialData.js', seederContent);
console.log('✅ Created: seeders/initialData.js');

console.log('\n🎉 All files created successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run "npm install" to install dependencies');
console.log('2. Update .env file with your actual values');
console.log('3. Set FORMSUBMIT_EMAIL in .env to receive email notifications');
console.log('4. Run "npm run seed" to populate initial data');
console.log('5. Run "npm start" to start the server');
console.log('\n📧 Email notifications will be sent via FormSubmit to the email configured in FORMSUBMIT_EMAIL');
console.log('\n🚀 For Vercel deployment:');
console.log('1. Push code to GitHub');
console.log('2. Import project to Vercel');
console.log('3. Add all environment variables in Vercel dashboard');
console.log('4. Deploy!');