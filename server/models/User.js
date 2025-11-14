import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import moment from 'moment'; 

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
        select: false, 
    },
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
        type: [String], 
        default: [],
    },
    avatarUrl: {
        type: String,
        default: 'https://i.pravatar.cc/150', }
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
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

UserSchema.methods.comparePassword = async function (candidatePassword) {
   
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);