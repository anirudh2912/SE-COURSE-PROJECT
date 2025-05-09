const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Save token & update login time
    user.tokens = user.tokens.concat({ token });
    user.lastLoggedIn = new Date(); // ✅ Update login timestamp
    await user.save();

    // ✅ Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict'
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Validation
    if (!normalizedEmail.endsWith('@mahindrauniversity.edu.in')) {
      return res.status(400).json({
        success: false,
        message: 'Only Mahindra University emails allowed'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
      name: name.trim(),
      tokens: [],
      lastLoggedIn: null
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    newUser.tokens = [{ token }];
    await newUser.save();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      tokenObj => tokenObj.token !== req.token
    );
    await req.user.save();

    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

const testConnection = (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working',
    timestamp: new Date()
  });
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  testConnection
};
