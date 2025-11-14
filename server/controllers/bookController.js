// server/controllers/bookController.js (ES MODULE CORRECTED)

import Book from '../models/Book.js'; // Import model with .js extension
import authMiddleware from '../middleware/authMiddleware.js'; // If used internally

// =========================================================================
// POST /api/books — Add Book (Protected)
// =========================================================================
export const addBook = async (req, res) => { // MUST use 'export const'
    const { title, author, coverImage, pageCount } = req.body;

    try {
        const newBook = new Book({
            title,
            author,
            coverImage,
            pageCount,
            addedBy: req.user._id // Assuming user ID is available from authMiddleware
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add book: ' + error.message });
    }
};

// =========================================================================
// GET /api/books — Search Books (Public)
// =========================================================================
export const searchBooks = async (req, res) => { // MUST use 'export const'
    const { q } = req.query; // Query parameter is 'q'

    if (!q) {
        return res.status(400).json({ error: 'Search query (q) is required.' });
    }

    try {
        const books = await Book.find({
            $or: [
                { title: { $regex: q, $options: 'i' } }, // Case-insensitive search on title
                { author: { $regex: q, $options: 'i' } } // Case-insensitive search on author
            ]
        }).limit(20);

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Server error during book search: ' + error.message });
    }
};

// If using ES Modules, you do NOT need a module.exports block.