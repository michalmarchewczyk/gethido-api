const logger = require('./logger');
const moment = require('moment');
const fs = require('fs').promises;

test('Initialization', async () => {
    let logFiles = await fs.readdir('./logs/');
    let lastFile = logFiles[logFiles.length-1];
    
    expect(moment().diff(moment(lastFile.substr(5, 19), 'YYYY-MM-DD_HH-mm-ss'))).toBeLessThan(2000);
    
    let file = await fs.readFile(`./logs/${lastFile}`);
    
    let logs = file.toString().split('\n');
    
    expect(logs[0]).toBe(`Logs_${moment(lastFile.substr(5, 19), 'YYYY-MM-DD_HH-mm-ss').format('YYYY-MM-DD_HH:mm:ss')}`);
    
    expect(logs[1].trim()).toMatch(/Info: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \(\+?-?\d{1,2}.\d{3}s\): Logger initialized/);

    
});

test('Logger basic types', async() => {
    let logFiles = await fs.readdir('./logs/');
    let lastFile = logFiles[logFiles.length-1];
    
    logger.emit('log', 'Testing logger');
    
    let file = await fs.readFile(`./logs/${lastFile}`);
    let logs = file.toString().split('\n');
    
    expect(logs[2].trim()).toMatch(/Info: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \(\+\d{2}.\d{3}s\): Testing logger/);
    
    logger.emit('error', 'Some error');
    file = await fs.readFile(`./logs/${lastFile}`);
    logs = file.toString().split('\n');
    
    expect(logs[3].trim()).toMatch(/Error: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \(\+\d{2}.\d{3}s\): Some error/);
    
    logger.emit('test', 'Some test');
    file = await fs.readFile(`./logs/${lastFile}`);
    logs = file.toString().split('\n');
    
    expect(logs[4].trim()).toMatch(/Test: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \(\+\d{2}.\d{3}s\): Some test/);
    
});


test('Logger custom types', async() => {
    let logFiles = await fs.readdir('./logs/');
    let lastFile = logFiles[logFiles.length-1];
    
    logger.emit('http', 'Some http');
    let file = await fs.readFile(`./logs/${lastFile}`);
    let logs = file.toString().split('\n');
    
    expect(logs[5].trim()).toMatch(/Http action: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \(\+\d{2}.\d{3}s\): Some http/);
    
    logger.emit('user', 'Some user');
    file = await fs.readFile(`./logs/${lastFile}`);
    logs = file.toString().split('\n');
    
    expect(logs[6].trim()).toMatch(/User action: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \(\+\d{2}.\d{3}s\): Some user/);
    
    logger.emit('tasks', 'Some tasks');
    file = await fs.readFile(`./logs/${lastFile}`);
    logs = file.toString().split('\n');
    
    expect(logs[7].trim()).toMatch(/Tasks action: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \(\+\d{2}.\d{3}s\): Some tasks/);
    
    logger.emit('email', 'Some email');
    file = await fs.readFile(`./logs/${lastFile}`);
    logs = file.toString().split('\n');
    
    expect(logs[8].trim()).toMatch(/Email action: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \(\+\d{2}.\d{3}s\): Some email/);
    
});
