const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./middleware/logger');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(logger.middleware);


app.use('/user', require('./users/usersRoutes'));





const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    logger.emit('log', `Server listening on port ${PORT}`)
});


