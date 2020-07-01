const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    email: String,
    password: String,
    settings: {
        darkTheme: {type: Boolean, default: false},
        emails: [String],
        emailsPassword: String,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
