const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./middleware/logger');
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use(logger.middleware);


app.use('/user', require('./users/usersRoutes'));

app.use('/tasks', require('./tasks/tasksRoutes'));


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    logger.emit('log', `Server listening on port ${PORT}`);
});


