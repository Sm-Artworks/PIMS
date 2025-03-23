// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }
    
    // Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// Token refresh route
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: true, message: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: true, message: 'Invalid refresh token' });
    }
    
    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ accessToken });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(401).json({ error: true, message: 'Invalid refresh token' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // In a stateless JWT setup, the client is responsible for discarding tokens
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;

// routes/medications.js
const express = require('express');
const Medication = require('../models/Medication');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all medications
router.get('/', auth, async (req, res) => {
  try {
    const medications = await Medication.find();
    res.json(medications);
  } catch (err) {
    console.error('Error fetching medications:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// Get medication by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: true, message: 'Medication not found' });
    }
    res.json(medication);
  } catch (err) {
    console.error('Error fetching medication:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// Create medication
router.post('/', auth, async (req, res) => {
  try {
    const newMedication = new Medication(req.body);
    const savedMedication = await newMedication.save();
    res.status(201).json(savedMedication);
  } catch (err) {
    console.error('Error creating medication:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Update medication
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedMedication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedMedication) {
      return res.status(404).json({ error: true, message: 'Medication not found' });
    }
    
    res.json(updatedMedication);
  } catch (err) {
    console.error('Error updating medication:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Delete medication
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedMedication = await Medication.findByIdAndDelete(req.params.id);
    
    if (!deletedMedication) {
      return res.status(404).json({ error: true, message: 'Medication not found' });
    }
    
    res.json({ success: true, message: 'Medication deleted successfully' });
  } catch (err) {
    console.error('Error deleting medication:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// Search medications
router.get('/search', auth, async (req, res) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).json({ error: true, message: 'Search term is required' });
    }
    
    const medications = await Medication.find({
      $or: [
        { name: { $regex: term, $options: 'i' } },
        { genericName: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } }
      ]
    });
    
    res.json(medications);
  } catch (err) {
    console.error('Error searching medications:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// Get low stock medications
router.get('/low-stock', auth, async (req, res) => {
  try {
    const medications = await Medication.find();
    const lowStockMeds = medications.filter(med => med.currentStock <= med.reorderLevel);
    res.json(lowStockMeds);
  } catch (err) {
    console.error('Error fetching low stock medications:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// Get expiring medications
router.get('/expiring-soon', auth, async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    const expiringMeds = await Medication.find({
      expirationDate: { $gte: today, $lte: thirtyDaysLater }
    });
    
    res.json(expiringMeds);
  } catch (err) {
    console.error('Error fetching expiring medications:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// Barcode scan endpoint
router.post('/scan', auth, async (req, res) => {
  try {
    const { barcode } = req.body;
    
    if (!barcode) {
      return res.status(400).json({ error: true, message: 'Barcode is required' });
    }
    
    const medication = await Medication.findOne({ barcode });
    
    if (!medication) {
      return res.status(404).json({ error: true, message: 'Medication not found' });
    }
    
    res.json(medication);
  } catch (err) {
    console.error('Error scanning barcode:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

module.exports = router;

// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ error: true, message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user ID and role to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    
    next();
  } catch (err) {
    res.status(401).json({ error: true, message: 'Token is not valid' });
  }
};
