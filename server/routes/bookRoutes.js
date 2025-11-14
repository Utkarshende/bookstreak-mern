// server/routes/bookRoutes.js

import express from 'express';

// 1. Import controller functions (using named imports from bookController.js)
import { addBook, searchBooks } from '../controllers/bookController.js';

// 2. Import middleware (assuming it uses a default export)
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// GET /api/books (search)
// Route for searching the book catalog by title/author. (Public route)
router.get('/', searchBooks); 

// POST /api/books (add book)
// Route for adding a new book to the catalog. (Protected route)
router.post('/', authMiddleware, addBook);

export default router;