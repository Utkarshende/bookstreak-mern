import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReadingSessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book', 
        required: false, 
    },
    
    date: {
        type: Date,
        required: true,
        
        unique: true,
        index: true
    },
    pagesRead: {
        type: Number,
        required: true,
        default: 1, 
        min: 1
    },
    notes: {
        type: String,
        trim: true,
    },
}, { 
    timestamps: true 
});


ReadingSessionSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('ReadingSession', ReadingSessionSchema);