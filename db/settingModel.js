const mongoose = require('mongoose');


const settingSchema = new mongoose.Schema({
    name: String,
    value: mongoose.Mixed
    
});


const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
