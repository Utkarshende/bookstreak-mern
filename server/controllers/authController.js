// server/controllers/authController.js (ES MODULE CORRECTED)

import jwt from 'jsonwebtoken';   // Convert to import
import bcrypt from 'bcrypt';     // Convert to import
import User from '../models/User.js'; // Convert to import and add .js extension
import 'dotenv/config'; // Ensure JWT_SECRET is loaded

// Helper function to create JWT token
const createToken = (_id) => {
    // JWT_SECRET is available via process.env because it's loaded in server.js/dotenv
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// =========================================================================
// POST /api/auth/register
// =========================================================================
export const register = async (req, res) => { // Use 'export const'
    const { name, email, password } = req.body;

    try {
        // Mongoose pre-save middleware in User.js handles hashing the password
        const user = await User.create({ name, email, password });
        
        // Initial Streak and Points setup
        // Mark the first reading session to set the initial streak/points
        user.streak = 1;
        user.points = 10;
        user.streakLastUpdate = new Date();
        await user.save(); // Save the initial streak/points

        // Create token for the new user
        const token = createToken(user._id);

        res.status(201).json({ 
            user: {
                _id: user._id, 
                name: user.name, 
                email: user.email,
                streak: user.streak,
                points: user.points,
                totalPages: user.totalPages,
                badges: user.badges
            }, 
            token 
        });
    } catch (error) {
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }
        res.status(500).json({ error: error.message });
    }
};

// =========================================================================
// POST /api/auth/login
// =========================================================================
export const login = async (req, res) => { // Use 'export const'
    const { email, password } = req.body;

    try {
        // Find user and explicitly select the password field for comparison
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Create token
        const token = createToken(user._id);

        // Send back user data (excluding the password hash)
        res.status(200).json({ 
            user: {
                _id: user._id, 
                name: user.name, 
                email: user.email,
                streak: user.streak,
                points: user.points,
                totalPages: user.totalPages,
                badges: user.badges
            }, 
            token 
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

// =========================================================================
// GET /api/auth/profile
// =========================================================================
export const getProfile = async (req, res) => { // Use 'export const'
    // req.user is populated by the authMiddleware
    // Since the middleware fetched the user, we just return the data
    res.status(200).json(req.user);
};