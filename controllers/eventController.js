const express = require('express');
const router = express.Router();


const User = require('../models/user');
const Calendar = require('../models/calendar');
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
	if(hour < 10) {
		hour = `0${hour}`;
	}
	if(newHour < 10) {
		newHour = `0${newHour}`
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

	res.render('events/new.ejs', {timeArray: timeArray});
});

//CREATE EVENT ROUTE
router.post('/', async (req, res) => {
	try{

		//change allDay from on to true/false
		if(req.body.allDay === 'on') {
			req.body.allDay = true;
		} else {
			req.body.allDay = false;
		};
	
		//convert long string of people into different people that can saved into people array
		let index = 0;
	
		//need to find which calendar the user is using
		const foundUser = await User.findById(req.session.userId);
		console.log(req.body)
	
		//used to loop over and split all the different people/emails entered into req.body.people
		while(req.body.people.indexOf('\r\n', index) !== -1) {
			let prevIndex = index;
			index = req.body.people.indexOf('\r\n', index);
			//save the string to the calendar being selected
			if(prevIndex === 0) {
				prevIndex = prevIndex - 1;
			}
			//used to correctly splice the email address
			const person = req.body.people.slice(prevIndex + 1, index);
			console.log(person);
			index = index + 1;
		}
		const person = req.body.people.slice(index + 1);
		console.log(person);

		res.send('you done posted')
	} catch (err) {
		console.log(err, 'error with event create route')
	}
})


//SHOW EVENT ROUTE
router.get('/:id', async (req, res) => {

	try {

		//const foundEvent = await Event.findById(req.params.id);
		//const foundCalendar = await Calendar.findById(foundEvent.calendarId);
		const foundEvent = { name: 'Testing1',
  							 startDate: '2018-07-22',
  							 startTime: '03:00',
  							 endDate: '2018-07-22',
  							 endTime: '04:00',
  							 people: ['antying@gmail.com'],
  							 location: 'asdf',
  							 allDay: false };
		res.render('events/show.ejs', {
			event: foundEvent
			//calendar: foundCalendar
		})
	} catch (err) {
		console.log(err, 'error with event show route')
	}
})

module.exports = router;