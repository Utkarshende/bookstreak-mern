// server/models/ReadingSession.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReadingSessionSchema = new Schema({
    // Links this reading session back to the specific user
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // References the 'User' model
        required: true,
    },
    // Links this reading session to the book being read
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book', // References the 'Book' model (you will create this later)
        // Set as optional for now if you haven't implemented the Book model yet,
        // but it is core to the feature.
        required: false, 
    },
    // The specific day the page was completed. 
    // This is CRITICAL for the streak calculation.
    date: {
        type: Date,
        required: true,
        // We ensure a user only has one entry per user/book/day combination
        unique: true,
        index: true
    },
    pagesRead: {
        type: Number,
        required: true,
        default: 1, // Default is 1 page to maintain the streak
        min: 1
    },
    notes: {
        type: String,
        trim: true,
    },
}, { 
    timestamps: true 
});

// A compound index to enforce uniqueness per user and per day, 
// ensuring a user can only mark completion once per day.
ReadingSessionSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('ReadingSession', ReadingSessionSchema);