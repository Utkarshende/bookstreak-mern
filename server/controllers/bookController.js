import Book from '../models/Book.js'; 
import authMiddleware from '../middleware/authMiddleware.js'; 


export const addBook = async (req, res) => { 
    const { title, author, coverImage, pageCount } = req.body;

    try {
        const newBook = new Book({
            title,
            author,
            coverImage,
            pageCount,
            addedBy: req.user._id 
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add book: ' + error.message });
    }
};

export const searchBooks = async (req, res) => { 
    const { q } = req.query; 

    if (!q) {
        return res.status(400).json({ error: 'Search query (q) is required.' });
    }

    try {
        const books = await Book.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { author: { $regex: q, $options: 'i' } } 
            ]
        }).limit(20);

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Server error during book search: ' + error.message });
    }
};

