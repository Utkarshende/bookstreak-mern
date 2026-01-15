import mongoose from 'mongoose';
const { Schema } = mongoose;

const MessageSchema = new Schema({
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
    senderName: {
        type: String,
        default: 'Anonymous'
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, 
    },
    content: {
        type: String,
        required: true,
        maxlength: 500 
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text'
    },
    attachmentUrl: {
        type: String,
        default: null
    },
    edited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date,
        default: null
    },
    reactions: [{
        emoji: String,
        userId: Schema.Types.ObjectId,
        userName: String,
        _id: false
    }],
    readBy: [{
        userId: Schema.Types.ObjectId,
        readAt: Date,
        _id: false
    }],
}, { 
    timestamps: true 
});

// Add index for faster queries
MessageSchema.index({ room: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });

export default mongoose.model('Message', MessageSchema);