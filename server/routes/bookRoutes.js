
import express from 'express';

import { addBook, searchBooks } from '../controllers/bookController.js';


import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/', searchBooks); 


router.post('/', authMiddleware, addBook);

export default router;