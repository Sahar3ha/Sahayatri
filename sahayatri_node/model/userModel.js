const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordHistory: [{ 
        type: String 
    }],
    passwordChangedAt: { 
        type: Date, 
        default: Date.now 
    },
    loginAttempts: { 
        type: Number, 
        default: 0 
    },
    lockUntil: { 
        type: Date 
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
