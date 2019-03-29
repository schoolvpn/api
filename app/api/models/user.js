const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: new Date()
    },
    lastoginAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    picture: {
        type: String
    },
    role: {
        type: String
    }, 
    verified: {
        type: Boolean,
        required: true
    },
    authCode: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { 
        type: String, 
        required: true,
        match: /.{3,}/ 
    },
    resetCode: { 
        type: String, 
        required: true,
        unique: true
    },
});

module.exports = mongoose.model('User', userSchema);