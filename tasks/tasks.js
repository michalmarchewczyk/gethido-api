const stages = require('./tasksStages');
const logger = require('../middleware/logger');
const db = require('../db/db');

const getTaskId = async () => {
    const id = await db.Setting.findOneAndUpdate({name: "taskId"}, {$inc: {'value': 1}});
    if(!id) return false;
    return id.value;
};

const checkStage = async (stage) => {
    return Object.values(stages).includes(stage);
};

const getTasks = async ({userId, stage}) => {
    const tasks = await db.Task.find({userId: userId, stage: stage});

    if(!tasks){
        logger.emit('tasks', `Error fetching tasks from ${stage}`);
        return false;
    }

    return tasks;
};

const getTask = async ({userId, id}) => {

    const task = await db.Task.findOne({userId: userId, id: id});

    if(!task) {
        logger.emit('tasks', `Could not find task with id ${id}`);
        return false;
    }

    return task;
};

const createTask = async({userId, name, stage, description}) => {

    const taskId = await getTaskId();

    if(!(await checkStage(stage))){
        logger.emit('tasks', `Invalid stage: ${stage}`);
        return false;
    }

    const newTask = new db.Task({
        id: taskId,
        userId: userId,
        stage: stage,
        name: name,
        description: description,
        date: Date.now(),
        completed: false,
        tags: [],
        source: "API",
    });

    try{
        const saveTask = await newTask.save();

        logger.emit('tasks', `Task created: ${newTask.id}`);
        return newTask;
    }catch (err){
        logger.emit('error', `Task save error: ${err}`);
        return false;
    }
};

const moveTask = async({userId, id, stage}) => {

    if(!(await checkStage(stage))){
        logger.emit('tasks', `Invalid stage: ${stage}`);
        return false;
    }

    try {
        const task = await db.Task.findOneAndUpdate({userId: userId, id: id}, {stage: stage}, {new: true});

        if(!task){
            logger.emit('tasks', `Error while moving task id: ${id} to ${stage}`);
            return false;
        }

        logger.emit('tasks', `Moved task id: ${id} to ${stage}`);
        return task;
    }catch(err){
        logger.emit('tasks', `Error while moving task id: ${id} to ${stage}`);
        return false;
    }
};

const updateTask = async({userId, id, name, description, completed}) => {

    const updateData = {};
    if(name) updateData.name = name;
    if(description) updateData.description = description;
    if(completed) updateData.completed = completed;

    try {
        const task = await db.Task.findOneAndUpdate({userId: userId, id: id}, {...updateData}, {new: true});

        if(!task){
            logger.emit('tasks', `Error while updating task id: ${id}`);
            return false;
        }

        logger.emit('tasks', `Updated task id: ${id}`);
        return task;
    }catch(err){
        logger.emit('tasks', `Error while updating task id: ${id}`);
        return false;
    }
};

const tagTask = async({userId, id, tags}) => {

    try {
        const task = await db.Task.findOneAndUpdate({userId: userId, id: id}, {tags: tags}, {new: true});

        if(!task){
            logger.emit('tasks', `Error while updating tags in task id: ${id}`);
            return false;
        }

        logger.emit('tasks', `Updated tags in task id: ${id}`);
        return task;
    }catch(err){
        logger.emit('tasks', `Error while updating tags in task id: ${id}`);
        return false;
    }
};

const getTagTasks = async ({userId, tag}) => {
    const tasks = await db.Task.find({userId: userId, tags: {$regex: new RegExp("^" + tag, "i")} });

    if(!tasks){
        logger.emit('tasks', `Error fetching tasks with tag ${tag}`);
        return false;
    }

    return tasks;
};

const deleteTask = async({userId, id}) => {

    try {
        const task = await db.Task.findOneAndRemove({userId: userId, id: id});

        if(!task){
            logger.emit('tasks', `Error while deleting task id: ${id}`);
            return false;
        }

        logger.emit('tasks', `Deleted task id: ${id}`);
        return task;
    }catch(err){
        logger.emit('tasks', `Error while deleting task id: ${id}`);
        return false;
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    moveTask,
    updateTask,
    tagTask,
    getTagTasks,
    deleteTask,
};
