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
    attachmentUrl: {
        type: String,
        default: null
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Message', MessageSchema);