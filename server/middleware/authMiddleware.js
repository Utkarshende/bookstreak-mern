// server/middleware/authMiddleware.js (ES MODULE CORRECTED)

import jwt from 'jsonwebtoken'; // Convert to import
import User from '../models/User.js'; // Convert to import and add .js extension

// Load secret from .env, though it should be loaded in server.js
import 'dotenv/config'; 

const authMiddleware = async (req, res, next) => {
    // 1. Check for token in headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication invalid: Token missing.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Find the user (exclude the password hash)
        const user = await User.findById(decoded._id).select('-password');
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication invalid: User not found.' });
        }

        // 4. Attach user object to the request
        req.user = user;
        
        // 5. Continue to the next middleware or route handler
        next();
        
    } catch (error) {
        // This catches errors like expired tokens or invalid signatures
        res.status(401).json({ error: 'Authentication invalid: ' + error.message });
    }
};

// Use export default for the middleware
export default authMiddleware;