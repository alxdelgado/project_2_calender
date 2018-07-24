const mongoose = require('mongoose');

const Event = require('./event');


const calendarSchema = new mongoose.Schema({
	name: {type: String, required: true},
	color: {type: String, default: 'Blue'},
	events: [Event.schema], 
	userId: String
});


module.exports = mongoose.model('Calendar', calendarSchema);







