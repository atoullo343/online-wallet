const mongoose = require('mongoose');

let d = new Date();
let date = [d.getDate(), d.getMonth()+1, d.getFullYear()].join('.');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: date
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;