const mongoose = require('mongoose');
const stages = require('../tasks/tasksStages');

const taskSchema = new mongoose.Schema({
    id: Number,
    userId: Number,
    stage: {
        type: String,
        enum: [stages.inbox, stages.trash, stages.someday, stages.reference, stages.next, stages.waiting, stages.projects, stages.calendar, stages.completed,]
    },
    name: String,
    description: String,
    date: Date,
    calDate: {type: Date, default: null},
    completed: {type: Boolean, default: false},
    tags: [String],
    source: String,
    email: {type: String, default: null},
    emailUID: {type: Number, default: null},
});


taskSchema.index({name: 'text'});


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
