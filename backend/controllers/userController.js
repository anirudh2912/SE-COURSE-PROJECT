const User = require('../models/User');

// ===============================
// Get Logged-in Users Controller
// ===============================
// @route   GET /api/users/loggedin
// @desc    Get users who have logged in at least once
const getLoggedInUsers = async (req, res) => {
  try {
    const users = await User.find(
      { lastLoggedIn: { $ne: null } },
      'name email lastLoggedIn'
    ).sort({ lastLoggedIn: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching logged-in users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ===============================
// Search Users Controller
// ===============================
// @route   GET /api/users/search?query=John
// @desc    Search users by name or email
const searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const users = await User.find(
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      },
      'name email _id'
    );

    res.status(200).json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

module.exports = {
  getLoggedInUsers,
  searchUsers
};
