const {getTasks, getTask, createTask, moveTask, updateTask, tagTask, getTagTasks, deleteTask} = require('./tasks');
const stages = require('../tasks/tasksStages');
const db = require('../db/db');
const logger = require('../middleware/logger');
logger.emit('log', 'Testing tasks');

const TEST_USER_ID = 21;

let task_id;

test('Creating task', async () => {
    let newTask = await createTask({userId: TEST_USER_ID, name: 'test name', stage: 'inbox', description: 'test description', source: 'test'});

    expect(newTask).toBeTruthy();
    expect(typeof newTask.id).toBe('number');
    expect(newTask.userId).toBe(21);
    expect(newTask.stage).toBe('inbox');
    expect(newTask.name).toBe('test name');
    expect(newTask.description).toBe('test description');
    expect(newTask.date).toBeInstanceOf(Date);
    expect(newTask.completed).toBe(false);
    expect(newTask.tags).toBeTruthy();
    expect(newTask.source).toBe('test');
    expect(newTask.email).toBeNull();
    expect(newTask.emailUID).toBeNull();

});


test('Getting tasks', async () => {
   let tasks = await getTasks({userId: TEST_USER_ID, stage: 'inbox'});
   
   expect(tasks.length).toBe(1);
   
   let task = tasks[0];
   
   task_id = task.id;
   

});


test('Getting task', async () => {
   let task = await getTask({userId: TEST_USER_ID, id: task_id});
    
    expect(task).toBeTruthy();
    expect(typeof task.id).toBe('number');
    expect(task.userId).toBe(21);
    expect(task.stage).toBe('inbox');
    expect(task.name).toBe('test name');
    expect(task.description).toBe('test description');
    expect(task.date).toBeInstanceOf(Date);
    expect(task.completed).toBe(false);
    expect(task.tags).toBeTruthy();
    expect(task.source).toBe('test');
    expect(task.email).toBeNull();
    expect(task.emailUID).toBeNull();
});


test('Moving task', async () => {
    let newTask = await moveTask({userId: TEST_USER_ID, id: task_id, stage: 'next'});
    
    expect(newTask).toBeTruthy();
    expect(newTask.stage).toBe('next');
});


test('Updating task', async () => {
   let newTask = await updateTask({userId: TEST_USER_ID, id: task_id, name: 'new name', description: 'new description', completed: true});
   
   expect(newTask).toBeTruthy();
   expect(newTask.name).toBe('new name');
   expect(newTask.description).toBe('new description');
   expect(newTask.completed).toBe(true);
});


test('Tagging task', async () => {
    let newTask = await tagTask({userId: TEST_USER_ID, id: task_id, tags: ['new tag']});
    
    expect(newTask).toBeTruthy();
    expect(newTask.tags.length).toBe(1);
    expect(newTask.tags[0]).toBe('new tag');
});


test('Getting tasks by tag', async () => {
    let tasks = await getTagTasks({userId: TEST_USER_ID, tag: 'new tag'});
    
    expect(tasks.length).toBe(1);
    expect(tasks[0].tags.length).toBe(1);
    expect(tasks[0].tags[0]).toBe('new tag');
});

test('Deleting task', async () => {
    let task = await deleteTask({userId: TEST_USER_ID, id: task_id});
    
    expect(task).toBeTruthy();
});

test('Cleanup tasks', async () => {
    let tasks = await db.Task.deleteMany({userId: TEST_USER_ID});
    
    expect(tasks).toBeTruthy();
});
