// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      console.error('❌ MONGO_URI not found in environment variables.');
      process.exit(1);
    }

    // Mask the password part before logging (safe for console)
    console.log('🟢 Connecting to MongoDB with URI:', uri.replace(/:(.*)@/, ':<PASSWORD>@'));

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
