// server/models/Message.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const MessageSchema = new Schema({
    // The room/conversation ID (e.g., a sorted combination of two user IDs)
    room: {
        type: String, 
        required: true,
        index: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // Only required for 1:1 messages, not for group chat
        required: false, 
    },
    content: {
        type: String,
        required: true,
        maxlength: 500 // Limit message length
    },
    // Optional: for attachments/images
    attachmentUrl: {
        type: String,
        default: null
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Message', MessageSchema);