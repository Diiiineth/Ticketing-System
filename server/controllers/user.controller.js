// /controllers/authController.js

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const bcrypt = require('bcryptjs');

// Signup controller
const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ fullName, email, password });

    await newUser.save();

    const payload = {
      user: { id: newUser._id },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: { id: user._id },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Profile controller
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Registration
const adminRegister = async (req, res) => {
  const { email, password } = req.body;

  // Check if the admin already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin record
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    // Respond with a success message
    res.status(201).json({
      message: 'Admin registered successfully',
      adminId: newAdmin._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Check if the admin exists
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: 'Invalid admin credentials' });
  }

  // Compare the password
  const isPasswordValid = await admin.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid admin credentials' });
  }

  // Generate a JWT token
  const payload = {
    user: { id: admin._id, email: admin.email }, // Include admin ID and email in the payload
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({
    message: 'Admin login successful',
    token,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, getProfile, adminLogin, getAllUsers,adminRegister };
