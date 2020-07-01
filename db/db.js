const mongoose = require('mongoose');
const {DB_URL, DB_PARAMS} = require('./dbConfig');
const logger = require('../middleware/logger');


mongoose.connect(DB_URL, DB_PARAMS).then((res) => {
    logger.emit('log', `Connected to database: ${DB_URL}`);
}).catch((err) => {
    logger.emit('error', `Cannot connect to database: ${DB_URL}`);
});


const User = require('../db/userModel');
const Task = require('../db/taskModel');
const Setting = require('../db/settingModel');

module.exports = {
    User,
    Task,
    Setting,
};
