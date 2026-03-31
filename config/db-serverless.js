const mongoose = require('mongoose');

let isConnected = false;

module.exports = async function connectDB() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    
    isConnected = conn.connections[0].readyState === 1;
    console.log('MongoDB Connected Successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};