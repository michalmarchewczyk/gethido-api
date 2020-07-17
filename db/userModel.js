const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    email: String,
    password: String,
    settings: {
        darkTheme: {type: Boolean, default: false},
        largeFont: {type: Boolean, default: false},
        autoCompleted: {type: Boolean, default: false},
        autoCalendar: {type: Boolean, default: false},
        allOptions: {type: Boolean, default: false},
        taskLink: {type: Boolean, default: false},
        emails: [String],
        emailsPassword: String,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
