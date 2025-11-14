// server/models/User.js (ES MODULE CORRECTED)

import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // Convert to import
import moment from 'moment'; // Convert to import

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // Prevents the password hash from being returned by default queries
    },
    // Streak and Rewards Fields
    streak: {
        type: Number,
        default: 0,
    },
    streakLastUpdate: {
        type: Date,
        default: null,
    },
    totalPages: {
        type: Number,
        default: 0,
    },
    points: {
        type: Number,
        default: 0,
    },
    badges: {
        type: [String], // Array of badge names (e.g., ['Novice Reader', 'Streak Master'])
        default: [],
    },
    // Chat/Social Fields
    avatarUrl: {
        type: String,
        default: 'https://i.pravatar.cc/150', // Placeholder
    }
}, {
    timestamps: true
});

// --- Middleware: Hashing Password before Save ---
UserSchema.pre('save', async function (next) {
    // Only hash the password if it is new or has been modified
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// --- Instance Method: Compare Password ---
UserSchema.methods.comparePassword = async function (candidatePassword) {
    // Since 'select: false' is used, we must ensure 'this.password' is fetched 
    // when calling this method (e.g., during login, use .select('+password'))
    return await bcrypt.compare(candidatePassword, this.password);
};

// --- Export the Model ---
export default mongoose.model('User', UserSchema); // Use 'export default'