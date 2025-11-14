
import jwt from 'jsonwebtoken';   
import bcrypt from 'bcrypt';     
import User from '../models/User.js'; 
import 'dotenv/config'; 
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};


export const register = async (req, res) => { 
    const { name, email, password } = req.body;

    try {
       
        const user = await User.create({ name, email, password });
        
       
        user.streak = 1;
        user.points = 10;
        user.streakLastUpdate = new Date();
        await user.save(); 

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
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }
        res.status(500).json({ error: error.message });
    }
};


export const login = async (req, res) => { 
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = createToken(user._id);

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


export const getProfile = async (req, res) => { 
   
    res.status(200).json(req.user);
};