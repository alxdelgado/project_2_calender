const mongoose = require('mongoose');



const taskSchema = new mongoose.Schema({
	name: {type: String, required: true},
	dueDate: {type: Date},
	priority: {type: Number, min: 1, max: 4}
});

mongoose.model('Task', taskSchema);