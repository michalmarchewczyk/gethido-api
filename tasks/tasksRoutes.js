const express = require('express');
const {authorizeRequest} = require('../auth/userTokenAuth');
const stages = require('./tasksStages');
const {getTasksMiddleware, getTaskMiddleware, createTaskMiddleware, moveTaskMiddleware, deleteTaskMiddleware, updateTaskMiddleware, tagTaskMiddleware, getTagTasksMiddleware} = require('../tasks/tasksMiddleware');
const router = express.Router();
const logger = require('../middleware/logger');


router.use(authorizeRequest);


router.get(Object.values(stages).map(s => `/${s}`), getTasksMiddleware);

router.get('/:id', getTaskMiddleware);

router.post('/', createTaskMiddleware);

router.put('/move/:id', moveTaskMiddleware);

router.put('/:id', updateTaskMiddleware);

router.put('/tags/:id', tagTaskMiddleware);

router.get('/tags/:tag', getTagTasksMiddleware);

router.delete('/:id', deleteTaskMiddleware);




router.all('/*', (req, res) => {
    res.sendStatus(400);
});


module.exports = router;
