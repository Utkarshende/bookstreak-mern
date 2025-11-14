// server/routes/streakRoutes.js (CORRECTED ES MODULE)

import express from 'express'; // Convert to import
import { getLeaderboard } from '../controllers/readingController.js'; // Convert to named import and add .js extension

const router = express.Router();

// GET /api/streaks/leaderboard
// Route for getting the global streak leaderboard.
router.get('/leaderboard', getLeaderboard);

// You can add other streak-related routes here later, e.g., streak history.

export default router;