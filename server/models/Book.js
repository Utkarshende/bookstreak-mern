import mongoose from 'mongoose';
const { Schema } = mongoose;


const BookSchema = new Schema({
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
        default: 'https://placehold.co/400x600'
    },
    
    totalPages: {
        type: Number,
        min: 1,
        required: false 
    },

    metadata: {
        publisher: { type: String },
        isbn: { type: String, unique: true, sparse: true }, 
        language: { type: String, default: 'en' },
    },

    readCount: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true 
});

BookSchema.index({ title: 'text', author: 'text' });

export default mongoose.model('Book', BookSchema);