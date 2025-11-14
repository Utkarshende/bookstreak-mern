// server/models/Book.js
import mongoose from 'mongoose';
const { Schema } = mongoose;


const BookSchema = new Schema({
    // Core book identifiers
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    coverUrl: {
        type: String,
        default: 'https://placehold.co/400x600' // Placeholder image if none provided
    },
    
    // Physical details
    totalPages: {
        type: Number,
        min: 1,
        required: false // Optional, as you may not always know this
    },

    // Extended metadata (e.g., for external APIs like OpenLibrary)
    metadata: {
        publisher: { type: String },
        isbn: { type: String, unique: true, sparse: true }, // ISBN is a unique book identifier
        language: { type: String, default: 'en' },
        // Add more fields here as needed
    },

    // Tracking how often this book is read in the app (optional feature)
    readCount: {
        type: Number,
        default: 0
    },

    // If you allow users to suggest books, you might track the creator
    // createdBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: false
    // }

}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Create a compound index for fast searching by title and author
BookSchema.index({ title: 'text', author: 'text' });

export default mongoose.model('Book', BookSchema);