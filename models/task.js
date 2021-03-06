const mongoose = require('mongoose');

const User = require('./user'); 

const taskSchema = new mongoose.Schema({
	name: {type: String, required: true},
	dueDate: {type: Date},
	priority: {type: Number, min: 1, max: 4}
});

module.exports = mongoose.model('Task', taskSchema);