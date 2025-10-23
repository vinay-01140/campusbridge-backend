// backend/middleware/auth.js
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const header = req.header('Authorization') || '';
    // Accept header like: "Bearer <token>" or "Token <token>" or token via query string
    let token = null;
    if (header.startsWith('Bearer ')) token = header.replace('Bearer ', '');
    else if (header.startsWith('Token ')) token = header.replace('Token ', '');
    else token = req.query?.token;

    if (!token) return res.status(401).json({ message: 'No token provided' });

    const user = await User.findOne({ authToken: token }).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
  } catch (err) {
    console.error('auth error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

module.exports = { auth, requireAdmin };
