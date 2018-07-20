const express = require('express');
const router = express.Router();


const User = require('../models/user');


const Event = require('../models/event');

// making middleware to redirect to login page unless user is logged in
router.use((req, res, next) => {

	//ONLY USED FOR TESTING
	req.session.logged = true;


	// console.log(req.session.cookie.path)
	if(!req.session.logged) {
		res.redirect('/user/login') //adjust home page to whatever the main loading page is
	} else {
		next();
	}
})


//function used to get day, month and year as strings
const getDateTime = () => {
	let today = new Date();
	let minute = today.getUTCMinutes();
	console.log(today)
	if(minute < 30) {
		minute = 30;
	} else {
		const milliseconds = today.getTime();
		const newMilliseconds = milliseconds + 1800000;
		today.setTime(newMilliseconds);
		minute = '00';
	}
	
	
	const day = today.getUTCDate();
	let month = today.getUTCMonth() + 1;
	const year = today.getUTCFullYear();
	let hour = today.getUTCHours() + 1;
	if(hour == 24) {
		hour = 0;
	}	
	const nowMilliseconds = today.getTime();
	const futureMilliseconds = nowMilliseconds + 1800000 + 1800000;
	today.setTime(futureMilliseconds);

	console.log(today)
	const newDay = today.getUTCDate();
	let newMonth = today.getUTCMonth() + 1;
	const newYear = today.getUTCFullYear();
	let newHour = today.getUTCHours() + 1;
	if(newHour == 24) {
		newHour = '00';
	}	
	//add 0 before month if month is less than 10
	if(month < 10) {
		month = `0${month}`;
	}
	if(newMonth < 10) {
		newMonth = `0${newMonth}`
	}
	const currentDateString = `${year}-${month}-${day}`;
	const currentTimeString = `${hour}:${minute}`;
	const futureDateString = `${newYear}-${newMonth}-${newDay}`
	const futureTimeString = `${newHour}:${minute}`;
	return [currentDateString, currentTimeString, futureDateString, futureTimeString]
}

//NEW EVENT ROUTE
router.get('/new', async (req, res) => {
	// const foundUser = await User.findById(req.sessions.userId);
	// res.render('/events/new.ejs', {
	// 	user: foundUser
	// });
	const timeArray = getDateTime();
	console.log(timeArray)

	res.render('events/new.ejs', {timeArray: timeArray});
});








module.exports = router;