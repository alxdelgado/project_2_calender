const mongoose = require('mongoose');

const Calendar = require('./calendar');
const Task = require('./task');

const now = new Date();

const userSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	preference: {type: String, default: "News"},
	created: {type: Date, default: now},
	openTasks: [Task.schema],
	closedTasks: [Task.schema],
	calendars: [Calendar.schema],
	timezone: Number 

});

module.exports = mongoose.model('User', userSchema);