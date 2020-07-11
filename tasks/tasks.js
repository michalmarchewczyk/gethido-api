const stages = require('./tasksStages');
const logger = require('../middleware/logger');
const db = require('../db/db');
const {getEmailList, getEmail} = require('../mail/mail');

const getTaskId = async () => {
    const id = await db.Setting.findOneAndUpdate({name: "taskId"}, {$inc: {'value': 1}});
    if (!id) return false;
    return id.value;
};

const checkStage = async (stage) => {
    return Object.values(stages).includes(stage);
};

const getTasks = async ({userId, stage}) => {
    
    if (stage === stages.inbox) {
        let tasksEmail = await createTasksFromEmails({userId});
    }
    
    const tasks = await db.Task.find({userId: userId, stage: stage});
    
    if (!tasks) {
        logger.emit('tasks', `Error fetching tasks from ${stage}`);
        return false;
    }
    
    return tasks;
};

const getTask = async ({userId, id}) => {
    
    let task = await db.Task.findOne({userId: userId, id: id});
    
    if (!task) {
        logger.emit('tasks', `Could not find task with id ${id}`);
        return false;
    }
    
    if (task.email && task.emailUID) {
        let message = await getTaskEmail({userId, emailAddress: task.email, emailUID: task.emailUID});
        if (!message) return false;
        task._doc.message = message;
        // console.log(task);
    }
    
    return task;
};

const createTask = async ({userId, name, stage, description, source, email, emailUID}) => {
    
    const taskId = await getTaskId();
    
    if (!(await checkStage(stage))) {
        logger.emit('tasks', `Invalid stage: ${stage}`);
        return false;
    }
    
    if (!email || !emailUID) {
        email = null;
        emailUID = null;
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
        source: source,
        email: email,
        emailUID: emailUID,
    });
    
    try {
        const saveTask = await newTask.save();
        
        logger.emit('tasks', `Task created: ${newTask.id} by ${userId}`);
        return newTask;
    } catch (err) {
        logger.emit('error', `Task save error: ${err}`);
        return false;
    }
};

const moveTask = async ({userId, id, stage}) => {
    
    if (!(await checkStage(stage))) {
        logger.emit('tasks', `Invalid stage: ${stage}`);
        return false;
    }
    
    try {
        const task = await db.Task.findOneAndUpdate({userId: userId, id: id}, {stage: stage}, {new: true});
        
        if (!task) {
            logger.emit('tasks', `Error while moving task id: ${id} to ${stage}`);
            return false;
        }
        
        logger.emit('tasks', `Moved task id: ${id} to ${stage}`);
        return task;
    } catch (err) {
        logger.emit('tasks', `Error while moving task id: ${id} to ${stage}`);
        return false;
    }
};

const updateTask = async ({userId, id, name, description, completed}) => {
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (!(typeof completed === 'undefined')) updateData.completed = completed;
    
    try {
        const task = await db.Task.findOneAndUpdate({userId: userId, id: id}, {...updateData}, {new: true});
        
        if (!task) {
            logger.emit('tasks', `Error while updating task id: ${id}`);
            return false;
        }
        
        logger.emit('tasks', `Updated task id: ${id}`);
        return task;
    } catch (err) {
        logger.emit('tasks', `Error while updating task id: ${id}`);
        return false;
    }
};

const tagTask = async ({userId, id, tags}) => {
    
    try {
        const task = await db.Task.findOneAndUpdate({userId: userId, id: id}, {tags: tags}, {new: true});
        
        if (!task) {
            logger.emit('tasks', `Error while updating tags in task id: ${id}`);
            return false;
        }
        
        logger.emit('tasks', `Updated tags in task id: ${id}`);
        return task;
    } catch (err) {
        logger.emit('tasks', `Error while updating tags in task id: ${id}`);
        return false;
    }
};

const getTagTasks = async ({userId, tag}) => {
    const tasks = await db.Task.find({userId: userId, tags: {$regex: new RegExp("^" + tag, "i")}});
    
    if (!tasks) {
        logger.emit('tasks', `Error fetching tasks with tag ${tag}`);
        return false;
    }
    
    return tasks;
};

const deleteTask = async ({userId, id}) => {
    
    try {
        const task = await db.Task.findOneAndRemove({userId: userId, id: id});
        
        if (!task) {
            logger.emit('tasks', `Error while deleting task id: ${id}`);
            return false;
        }
        
        logger.emit('tasks', `Deleted task id: ${id}`);
        return task;
    } catch (err) {
        logger.emit('tasks', `Error while deleting task id: ${id}`);
        return false;
    }
};


const createTasksFromEmails = async ({userId}) => {
    logger.emit('email', `Fetch emails by: ${userId}`);
    const findUser = await db.User.findOne({id: userId}, 'settings');
    const settings = findUser._doc.settings;
    if (!settings || !settings.emails || !settings.emailsPassword) return false;
    
    const emailAddresses = settings.emails.filter(e => !e.startsWith('!'));
    const emailsPassword = settings.emailsPassword;
    
    let emails = await Promise.all(emailAddresses.map(async (email) => {
        let lastUid = await db.Task.findOne({userId: userId, email: email}).sort({emailUID: -1}).limit(1);
        if (!lastUid) lastUid = 1;
        
        const username = email.split('@')[0];
        
        let messages = await getEmailList({
            username: username,
            password: emailsPassword,
            lastEmail: lastUid.emailUID + 1
        });
        if (!messages) messages = [];
        return messages;
    }));
    
    emails = emails.flat();
    logger.emit('email', `Fetched ${emails.length} new emails by: ${userId}`);
    let emailTasks = await Promise.all(emails.map(async (email) => {
        return createTask({
            userId,
            name: `Email: ${email.title}`,
            description: `Email from ${email.from}`,
            stage: 'inbox',
            source: 'email',
            email: email.email,
            emailUID: email.uid
        });
    }));
    // console.log(emailTasks);
    return emailTasks;
};

const getTaskEmail = async ({userId, emailAddress, emailUID}) => {
    logger.emit('email', `Get email ${emailAddress} uid:${emailUID} by: ${userId}`);
    const findUser = await db.User.findOne({id: userId, 'settings.emails': emailAddress}, 'settings');
    const settings = findUser._doc.settings;
    if (!settings || !settings.emails || !settings.emailsPassword) return false;
    
    const emailsPassword = settings.emailsPassword;
    const username = emailAddress.split('@')[0];
    
    let email = await getEmail({username: username, password: emailsPassword, emailUID: emailUID});
    
    
    if (!email[0]) return false;
    
    return email[0];
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
