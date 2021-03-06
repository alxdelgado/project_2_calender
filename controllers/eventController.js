const express = require('express');
const router = express.Router();


const User = require('../models/user');
const Calendar = require('../models/calendar');
const Event = require('../models/event');


router.use((req, res, next) => {
  if(req.session.logged !== true ) {
  	res.redirect('/user')
  } else {
  	next(); 
  }
});

// making middleware to redirect to login page unless user is logged in
router.use((req, res, next) => {

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
	
	//get the current day
	const day = today.getUTCDate();
	//get the current month
	let month = today.getUTCMonth() + 1;
	//get the current year
	const year = today.getUTCFullYear();
	//get the current hour
	let hour = today.getUTCHours() + 1;
	//change the hour to 0 if 24
	if(hour == 24) {
		hour = '00';
	}	
	//get the UTC milliseconds
	const nowMilliseconds = today.getTime();
	//add 1 hour to the UTC milliseconds
	const futureMilliseconds = nowMilliseconds + 1800000 + 1800000;
	//set the time to 1 hour from now
	today.setTime(futureMilliseconds);

	//get the new day
	const newDay = today.getUTCDate();
	//get the new month
	let newMonth = today.getUTCMonth() + 1;
	//get the new year
	const newYear = today.getUTCFullYear();
	//get the new year
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
	if(hour < 10 && hour != 0) {
		hour = `0${hour}`;
	}
	if(newHour < 10 && newHour != 0) {
		newHour = `0${newHour}`
	}
	//make a string in the format required for HTML Forms and the schema
	const currentDateString = `${year}-${month}-${day}`;
	const currentTimeString = `${hour}:${minute}`;
	const futureDateString = `${newYear}-${newMonth}-${newDay}`
	const futureTimeString = `${newHour}:${minute}`;
	return [currentDateString, currentTimeString, futureDateString, futureTimeString]
}

//NEW EVENT ROUTE
router.get('/new', async (req, res) => {
	const foundUser = await User.findById(req.session.userId);
	// console.log(foundUser)
	const timeArray = getDateTime();

	if(foundUser.calendars.length > 0){
		// console.log('error with the event/new route')
		res.render('events/new.ejs', {
			timeArray: timeArray,
			user: foundUser
		});
	
	} else {
		// console.log('whats going on?')
		res.redirect('/calendar/new')
	}
	
});

//NEW EVENT ROUTE
//used when clicking on the calendar to get the date for which the user clicked
router.get('/new/:year/:month/:day', async (req, res) => {
	const foundUser = await User.findById(req.session.userId);

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	let monthNumber;
	//find the number associated with the month
	for(let i = 0; i < monthNames.length; i++) {
		if(monthNames[i] == req.params.month) {
			monthNumber = i + 1;
		}
	}
	//if the month is <10, add a 0 before for the HTML form format
	if(monthNumber < 10) {
		monthNumber = `0${monthNumber}`;
	}
		
	//find the day as a number
	let dayNumber = parseInt(req.params.day);
	//if the day is <10, add a 0 before for the HTML form format
	if(req.params.day < 10) {
		dayNumber = `0${dayNumber}`;
	}	

	//make a string in the correct format for the HTML form
	const dateString = `${req.params.year}-${monthNumber}-${dayNumber}`
	const timeArray = [dateString, '08:00', dateString, '09:00'];


	//check if user has calendars. If not then redirect them to make a calendar
	if(foundUser.calendars.length > 0){
		res.render('events/new.ejs', {
			timeArray: timeArray,
			user: foundUser
		});
	
	} else {
		res.redirect('/calendar/new')
	}
	
});

//CREATE EVENT ROUTE
router.post('/', async (req, res) => {
	try {


		//change allDay from on to true/false
		if(req.body.allDay === 'on') {
			req.body.allDay = true;
		} else {
			req.body.allDay = false;
		};

		req.body.people = [];
		//add the people listed by the user in the req.body
		for(let i = 0; i < req.body['person[]'].length; i++) {
			if(req.body['person[]'][i] === '') {

			} else {
				req.body.people.push(req.body['person[]'][i])
			}
			
		}
		//find calendar the event was added to
		const foundCalendar = await Calendar.findById(req.body.calendarId);
		//save the calendar color to the created event
		req.body.calendarColor = foundCalendar.color;
		//create a new event in the EVENT Model
		const createdEvent = await Event.create(req.body);
		//push the new event into the found calendar's event array
		foundCalendar.events.push(createdEvent) 
		let saveEvent = await foundCalendar.save();

		//need to find which calendar the user is using
		const foundUser = await User.findById(req.session.userId);

		//find the calendar in the user calendar's array and push the event into the calendar
		for(let i = 0; i < foundUser.calendars.length; i++) {
			if(foundUser.calendars[i].id === req.body.calendarId)
				foundUser.calendars[i].events.push(createdEvent);
		}
		let saveEvent2 = await foundUser.save();
		res.redirect('/user'); 

	} catch (err) {
		console.log(err, 'error with event create route')
	}
});


//EDIT EVENT ROUTE
router.get('/:id/edit', async (req, res) => {
	try {
		//find event in Event model using id
		const foundEvent = await Event.findById(req.params.id);
		//find the calendar using the calendar id in the event
		const foundCalendar = await Calendar.findById(foundEvent.calendarId);
		//find the user
		const foundUser = await User.findById(req.session.userId);

		//render the edit page
		res.render('events/edit.ejs', {
			event: foundEvent,
			calendar: foundCalendar,
			user: foundUser
		})

	} catch (err) {
		console.log(err, 'error with event edit route');
	}
});

//PUT EVENT ROUTE
router.put('/:id', async (req, res) => {
	try {
		//change allDay from on to true/false
		if(req.body.allDay === 'on') {
			req.body.allDay = true;
		} else {
			req.body.allDay = false;
		};

		req.body.people = [];
		//add the people listed by the user in the req.body
		for(let i = 0; i < req.body['person[]'].length; i++) {
			if(req.body['person[]'][i] === '') {

			} else {
				req.body.people.push(req.body['person[]'][i])
			}	
		}

		const foundEvent = await Event.findById(req.params.id);

		//check if the calendar has been updated
		if(req.body.calendarId === foundEvent.calendarId) {
			//find and update the event in the event collection
			const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body);
			//find the calendar using the event
			const foundCalendar = await Calendar.findById(updatedEvent.calendarId);
			//find the user
			const foundUser = await User.findById(req.session.userId);

			let saveEvent;

			//search over the calendar event's array to find and update the event
			for(let i = 0; i < foundCalendar.events.length; i++) {
				if(foundCalendar.events[i].id === updatedEvent.id) {
					foundCalendar.events[i] = req.body
				}
			}
			//save the calendar
			foundCalendar.save();
			//find and loop over the user's calendars and event and update the correct event
			for(let i = 0; i < foundUser.calendars.length; i++) {
				if(foundUser.calendars[i].id === updatedEvent.calendarId) {
					for(let j = 0; j < foundUser.calendars[i].events.length; j++) {
						foundUser.calendars[i].events[j] = req.body;
					}
				}
			}	//save the user
			saveEvent = await foundUser.save();
		} else {
			//to be done if the calendar was changed by the user
			//find the old calendar using old calendarID
			const oldCalendar = await Calendar.findById(foundEvent.calendarId);
			//update the event to have the new information
			const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body);

			//find the new calendar
			const newCalendar = await Calendar.findById(updatedEvent.calendarId);

			const foundUser = await User.findById(req.session.userId);

			//loop over the old calendar events array and remove the event
			for(let i = 0; i < oldCalendar.events.length; i++) {
				if(updatedEvent.id === oldCalendar.events[i].id) {
					oldCalendar.events.splice(i, 1);
				}
			}

			saveEvent = await oldCalendar.save()
			//add the event to the new calendar
			newCalendar.events.push(updatedEvent);
			saveEvent = await newCalendar.save()


			//find the old calendar in the user model
			for(let i = 0; i < foundUser.calendars.length; i++) {
					if(foundUser.calendars[i].id === oldCalendar.id) {
						for(let j = 0; j < foundUser.calendars[i].events.length; j++) {
							if(foundUser.calendars[i].events[j].id === updatedEvent.id) {
								foundUser.calendars[i].events.splice(j, 1);
							}
						}


						//find the new calendar in the user and push the new event to it
					} else if(foundUser.calendars[i].id === newCalendar.id) {
						foundUser.calendars[i].events.push(updatedEvent);
					}
			}

			saveEvent = await foundUser.save();	
		}

		res.redirect('/user');


	} catch (err) {
		console.log(err, 'error with event put route')
	}
})


router.delete('/:id', async (req, res) => {
	try {
		console.log('got to delete event route')
		const foundEvent = await Event.findById(req.params.id);
		//find the event in the calendar and user collections
		const foundCalendar = await Calendar.findById(foundEvent.calendarId);
		const foundUser = await User.findById(req.session.userId);

		//find the event in the User model and remove
		foundUser.calendars.id(foundCalendar.id).events.id(foundEvent.id).remove();
		//find the event in the Calendar model and remove
		foundCalendar.events.id(foundEvent.id).remove();
		//save the User and Calendar models
		let saveEvent = await foundUser.save();
		saveEvent = await foundCalendar.save()
		//find the event in the Event model and remove
		const deletedEvent = await Event.findByIdAndRemove(req.params.id);
		//redirect to the User's home page
		res.redirect('/user/' + req.session.userId);

	} catch (err) {
		console.log(err, 'error with event delete route')
	}
})


//SHOW EVENT ROUTE
router.get('/:id', async (req, res) => {

	try {

		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		const foundEvent = await Event.findById(req.params.id);
		const foundCalendar = await Calendar.findById(foundEvent.calendarId);

		//find the month string and convert a number
		const startMonthNumber = parseInt(foundEvent.startDate.slice(5, 7));
		const startMonthName = monthNames[startMonthNumber - 1];
			
		//find the start year and date	
		const startYear = foundEvent.startDate.slice(0, 4);
		const startDate = foundEvent.startDate.slice(8, 10);

		//find the start hour and minutes
		let startHour = parseInt(foundEvent.startTime.slice(0, 2));
		const startMin = foundEvent.startTime.slice(3, 5);

		//set the default to AM
		let startMorning = 'a.m.';

		//if time is > 12, subtract 12 and make it PM
		if(startHour > 12) {
			startHour = startHour - 12;
			startMorning = 'p.m.';
		}

		const startDateString = `${startMonthName} ${startDate}, ${startYear}`;
		const startTimeString = `${startHour}:${startMin} ${startMorning}`;


		let endDateString = '';
		let endTimeString = '';


		if(foundCalendar.allDay != true) {

			//find the month string and convert a number
			const endMonthNumber = parseInt(foundEvent.endDate.slice(5, 7));
			const endMonthName = monthNames[endMonthNumber - 1];
				
			//find the start year and date	
			const endYear = foundEvent.endDate.slice(0, 4);
			const endDate = foundEvent.endDate.slice(8, 10);
	
			//find the start hour and minutes
			let endHour = parseInt(foundEvent.endTime.slice(0, 2));
			const endMin = foundEvent.endTime.slice(3, 5);
	
			//set the default to AM
			let endMorning = 'a.m.';
	
			//if time is > 12, subtract 12 and make it PM
			if(endHour > 12) {
				endHour = endHour - 12;
				endMorning = 'p.m.';
			}

			endDateString = `${endMonthName} ${startDate}, ${endYear}`;
			endTimeString = `${endHour}:${endMin} ${endMorning}`;
		}







		res.render('events/show.ejs', {
			event: foundEvent,
			calendar: foundCalendar, 
			startDateString: startDateString, 
			startTimeString: startTimeString,
			endDateString: endDateString,
			endTimeString: endTimeString
		})
	} catch (err) {
		console.log(err, 'error with event show route')
	}
})

module.exports = router;