const url = require('url');

const SERVER_URL = "mongodb://localhost:27017/";
const DB_NAME = "gethido";

const DB_URL = url.resolve(SERVER_URL, DB_NAME);

const DB_PARAMS = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true};

module.exports = {
    DB_URL,
    DB_PARAMS,
};
