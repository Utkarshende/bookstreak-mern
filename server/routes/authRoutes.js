// server/routes/authRoutes.js (CORRECTED ES MODULE)

import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; // Ensure this uses a default export

// 1. IMPORT CONTROLLER FUNCTIONS: 
// The authController exports: { register, login, getProfile }
import { register, login, getProfile } from '../controllers/authController.js'; 

const router = express.Router();

// Public Routes
// POST /api/auth/register
router.post('/register', register); 

// POST /api/auth/login
// Use the imported 'login' function name, not 'loginUser'
router.post('/login', login); // FIX: Changed 'loginUser' to 'login'

// Protected Route (requires JWT token)
// GET /api/auth/profile
router.get('/profile', authMiddleware, getProfile);

export default router;