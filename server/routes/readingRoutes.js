// server/routes/readingRoutes.js (CORRECTED ES MODULE)

import express from 'express'; // Need to import express to use router
import authMiddleware from '../middleware/authMiddleware.js'; // Use import and .js extension

// 1. Convert to NAMED IMPORT with .js extension
import { markPageCompleted } from '../controllers/readingController.js'; 

const router = express.Router();

// FIX: Changed the route path from '/' to '/log-reading' to match
// the path requested by the client and to be more descriptive.
// Route: POST /api/readings/log-reading
// Description: Logs pages read and runs the streak algorithm
// Protection: Requires a valid JWT (authMiddleware)
router.post('/log-reading', authMiddleware, markPageCompleted);

// You will add the history and leaderboard routes here later:
// router.get('/', authMiddleware, getReadingHistory); // GET /api/readings
// router.get('/leaderboard', getLeaderboard); // GET /api/streaks/leaderboard 

export default router;