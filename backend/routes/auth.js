const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  logoutUser,
  testConnection
} = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/logout', logoutUser);
router.get('/test', testConnection);

module.exports = router;