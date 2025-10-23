const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex'); // simple random token
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const authToken = generateToken();
    user = new User({ name, email, password: hashed, role: role || 'student', authToken });
    await user.save();

    res.status(201).json({ token: authToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('auth.register error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // create a fresh token on login
    user.authToken = generateToken();
    await user.save();

    res.json({ token: user.authToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('auth.login error:', err);
    res.status(500).json({ message: err.message });
  }
};

// logout - invalidates the stored token for the authenticated user
exports.logout = async (req, res) => {
  try {
    // req.user is set by middleware/auth.js
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.authToken = null;
    await user.save();

    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('auth.logout error:', err);
    res.status(500).json({ message: err.message });
  }
};
