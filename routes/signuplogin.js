const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user');

router.post('/signup', async (req, res) => { // Allow up to 3 files
    console.log('Signup request body:', req.body);
    const { name, email, password } = req.body;

    // check if email is in database
    const emailcheck = await User.findOne({ email }); 
    if (emailcheck) { 
        console.log('Email already exists:', email);
        return res.status(409).json({ message: 'Email already exists' });
    }

    try {
        const newUser  = new User({ name, email, password }); // Removed videos and points as not in schema
        await newUser.save();
        console.log('New user saved:', newUser);

        // Store user ID and email in session
        req.session.userId = newUser._id;
        req.session.email = newUser.email;

        res.status(201).send('User registered successfully!');

        } catch (error) {
            console.error('Error registering user:', error);
            res.status(400).send('Error registering user: ' + error.message);
        }
    });

// login route
router.post('/login', async (req, res) => {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            console.log('User logged in:', user);

            req.session.userId = user._id; // Set session on login
            req.session.email = user.email;
            res.json({ message: 'Login successful' });
            
        } else {
            console.log('Invalid login attempt:', email);
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;