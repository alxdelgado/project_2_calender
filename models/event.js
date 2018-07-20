const mongoose = require('mongoose');



let today = new Date();
let minute = today.getUTCMinutes();

if(minute < 30) {
	minute = 30;
} else {
	const milliseconds = today.getTime();
	const newMilliseconds = milliseconds + 1800000;
	today.setTime(newMilliseconds);
	minute = 0;
}


const day = today.getUTCDate();
const month = today.getUTCMonth() + 1;
const year = today.getUTCFullYear();
const hour = today.getUTCHours() + 1;


const futureTime = today.getTime() + 360000;
today.setTime(futureTime);

const newDay = today.getUTCDate();
const newMonth = today.getUTCMonth() + 1;
const newYear = today.getUTCFullYear();
const newHour = today.getUTCHours() + 1;


const eventSchema = new mongoose.Schema({
	name: {type: String, required: true},
	startDate: {type: String, required: true, default: `${month}/${day}/${year}`},
	endDate: {type: String, default: `${newMonth}/${newDay}/${newYear}`},
	startTime: {type: String, default: `${hour}:${minute}`},
	endTime: {type: String, default: `${newHour}:${minute}`},
	allDay: {type: Boolean, default: false},
	people: [{type: String}],
	location: String
});

mongoose.model('Event', eventSchema);