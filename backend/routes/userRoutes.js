const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getLoggedInUsers, searchUsers } = require('../controllers/userController'); // 👈 searchUsers included

// ===============================
// Login Controller
// ===============================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      success: true,
      user: { email: user.email, name: user.name },
      token: token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ===============================
// Register Controller
// ===============================
const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      success: true,
      user: { email: newUser.email, name: newUser.name },
      token: token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ===============================
// Routes
// ===============================

// 🔒 Auth routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// 👥 Fetch all users (names only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🕵️‍♂️ Get users who logged in (with createdAt)
router.get('/users/loggedin', getLoggedInUsers);

// 🔍 Search users by name/email
router.get('/search', searchUsers);

module.exports = router;
