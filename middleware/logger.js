const events = require('events');
const moment = require('moment');
const fs = require('fs');
const path = require('path');


const DIR_PATH = 'logs/';

const logger = new events.EventEmitter();

logger.fileName = `Logs_${moment().format("YYYY-MM-DD_HH-mm-ss")}.log`;
fs.appendFile(path.join(DIR_PATH, logger.fileName), `Logs_${moment().format("YYYY-MM-DD_HH:mm:ss")}`, (err) => {
    if(err) console.log(err);
});

logger.log = (type, msg) => {
    const log_msg = `${type.padStart(12, ' ')}: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS")} (+${moment.duration(moment().diff(logger.lastTime)).asSeconds().toFixed(3).padStart(6, '0')}s): ${msg}`;
    console.log(log_msg);
    fs.appendFile(path.join(DIR_PATH, logger.fileName), `\n${log_msg}`, (err) => {
        if(err) console.log(err);
    });
    logger.lastTime = moment();
};

logger.on('user', (msg) => {
    logger.log('User action', msg);
});

logger.on('tasks', (msg) => {
    logger.log('Tasks action', msg);
});

logger.on('email', (msg) => {
    logger.log('Email action', msg);
});

logger.on('log', (msg) => {
    logger.log('Info', msg);
});

logger.on('http', (msg) => {
    logger.log('Http action', msg);
});

logger.on('error', (msg) => {
    logger.log('Error', msg);
});

logger.on('test', (msg) => {
    logger.log('Test', msg);
});

logger.middleware = async (req, res, next) => {
  logger.emit('http', `${req.method} request to ${req.originalUrl}`);
  next();
};


logger.emit('log', 'Logger initialized');


module.exports = logger;
