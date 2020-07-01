const {getTasks, getTask, createTask, moveTask, updateTask, tagTask, getTagTasks, deleteTask} = require('./tasks');
const logger = require('../middleware/logger');


const getTasksMiddleware = async (req, res) => {
    const stage = req.url.substr(1);
    
    logger.emit('tasks', `Get ${stage} tasks by ${req.userId}`);
    
    const tasks = await getTasks({userId: req.userId, stage});
    
    if (!tasks) return res.sendStatus(400);
    
    res.json(tasks);
};

const getTaskMiddleware = async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (!id) return res.sendStatus(400);
    
    logger.emit('tasks', `Get task id: ${id} by ${req.userId}`);
    
    const task = await getTask({userId: req.userId, id});
    
    if (!task) return res.sendStatus(404);
    
    res.json(task);
};

const createTaskMiddleware = async (req, res) => {
    logger.emit('tasks', `Create task by ${req.userId}`);
    
    let {name, stage, description, source} = req.body;
    if (!name || !stage || !description) return res.sendStatus(400);
    if (!source) source = "API";
    
    const task = await createTask({userId: req.userId, name, stage, description, source});
    
    if (!task) return res.sendStatus(400);
    
    res.json(task);
};

const moveTaskMiddleware = async (req, res) => {
    const id = parseInt(req.params.id);
    const {destination} = req.body;
    if (!id || !destination) return res.sendStatus(400);
    
    logger.emit('tasks', `Move task id: ${id} to ${destination} by ${req.userId}`);
    
    const task = await moveTask({userId: req.userId, id, stage: destination});
    
    if (!task) return res.sendStatus(400);
    
    res.json(task);
};

const updateTaskMiddleware = async (req, res) => {
    const id = parseInt(req.params.id);
    const {name, description, completed} = req.body;
    if (!id) return res.sendStatus(400);
    if (!name && !description && !completed) return res.sendStatus(400);
    
    logger.emit('tasks', `Update task id: ${id} by ${req.userId}`);
    
    const task = await updateTask({userId: req.userId, id, name, description, completed});
    
    if (!task) return res.sendStatus(400);
    
    res.json(task);
};

const tagTaskMiddleware = async (req, res) => {
    const id = parseInt(req.params.id);
    const {tags} = req.body;
    if (!id) return res.sendStatus(400);
    if (!tags) return res.sendStatus(400);
    
    logger.emit('tasks', `Update tags in task id: ${id} by ${req.userId}`);
    
    const task = await tagTask({userId: req.userId, id, tags});
    
    if (!task) return res.sendStatus(400);
    
    res.json(task);
};

const getTagTasksMiddleware = async (req, res) => {
    const tag = req.params.tag.toUpperCase();
    
    // console.log(tag);
    
    logger.emit('tasks', `Get ${tag} tasks by ${req.userId}`);
    
    const tasks = await getTagTasks({userId: req.userId, tag});
    
    if (!tasks) return res.sendStatus(400);
    
    res.json(tasks);
};

const deleteTaskMiddleware = async (req, res) => {
    const id = parseInt(req.params.id);
    
    logger.emit('tasks', `Delete task id: ${id} by ${req.userId}`);
    
    const task = await deleteTask({userId: req.userId, id});
    
    if (!task) return res.sendStatus(400);
    
    res.json(task);
};

module.exports = {
    getTasksMiddleware,
    getTaskMiddleware,
    createTaskMiddleware,
    moveTaskMiddleware,
    updateTaskMiddleware,
    deleteTaskMiddleware,
    tagTaskMiddleware,
    getTagTasksMiddleware
};
