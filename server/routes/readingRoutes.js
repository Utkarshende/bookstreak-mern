
import express from 'express'; 
import authMiddleware from '../middleware/authMiddleware.js'; 


import { markPageCompleted } from '../controllers/readingController.js'; 

const router = express.Router();


router.post('/log-reading', authMiddleware, markPageCompleted);


export default router;