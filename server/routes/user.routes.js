// /routes/authRoutes.js

const express = require('express');
const { signup, login, getProfile,adminLogin ,getAllUsers,adminRegister } = require('../controllers/user.controller');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Get Profile (protected route)
router.get('/profile', auth, getProfile);
router.post('/admin-login', adminLogin); 

router.get('/users', getAllUsers);

router.post('/admin-register', adminRegister); // Admin registration route


module.exports = router;
