const express = require('express');
const router = express.Router();
const session = require('express-session'); 
const User = require('../models/user');
const { ensureSignedUp } = require('../middleware/auth');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current logged-in user info
router.get('/current', ensureSignedUp, async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId).select('name email');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
