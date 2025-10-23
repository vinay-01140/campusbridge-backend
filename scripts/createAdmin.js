require('dotenv').config();
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');

const generateToken = () => crypto.randomBytes(32).toString('hex');

(async () => {
  try {
    await connectDB();
    const exists = await User.findOne({ email: 'admin@campusbridge.test' });
    if (exists) { 
      console.log('Admin already exists');
      console.log('Admin token:', exists.authToken || 'no token set - login to get a token');
      process.exit(0);
    }
    const hashed = await bcrypt.hash('admin123', 10);
    const admin = new User({ name: 'Admin', email: 'admin@campusbridge.test', password: hashed, role: 'admin', authToken: generateToken() });
    await admin.save();
    console.log('Admin created: admin@campusbridge.test / admin123');
    console.log('Admin token:', admin.authToken);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
})();
