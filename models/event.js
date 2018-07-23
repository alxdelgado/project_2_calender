// const mongoose = require('mongoose');



// let today = new Date();
// let minute = today.getUTCMinutes();

// if(minute < 30) {
// 	minute = 30;
// } else {
// 	const milliseconds = today.getTime();
// 	const newMilliseconds = milliseconds + 1800000;
// 	today.setTime(newMilliseconds);
// 	minute = 0;
// }


// const day = today.getUTCDate();
// const month = today.getUTCMonth() + 1;
// const year = today.getUTCFullYear();
// const hour = today.getUTCHours() + 1;


// const futureTime = today.getTime() + 360000;
// today.setTime(futureTime);

// const newDay = today.getUTCDate();
// const newMonth = today.getUTCMonth() + 1;
// const newYear = today.getUTCFullYear();
// const newHour = today.getUTCHours() + 1;


const eventSchema = new mongoose.Schema({
	name: {type: String, required: true},
	startDate: {type: String, required: true},//format is YYYY/MM/DD
	endDate: {type: String}, 
	startTime: {type: String}, //format is HH:MM
	endTime: {type: String}, 
	allDay: {type: Boolean, default: false},
	people: [{type: String}],
	location: String, 
	calendarId: String
});


// module.exports = mongoose.model('Event', eventSchema);