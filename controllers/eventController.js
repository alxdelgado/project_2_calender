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
	const foundUser = await User.findById(req.session.userId);
	// console.log(foundUser)
	const timeArray = getDateTime();

	if(foundUser.calendars.length > 0){
		// console.log('error with the event/new route')
		console.log(foundUser.calendars)  
		res.render('events/new.ejs', {
			timeArray: timeArray,
			user: foundUser
		});
	
	} else {
		// console.log('whats going on?')
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
		console.log(req.body)

		req.body.people = [];
		//add the people listed by the user in the req.body
		for(let i = 0; i < req.body['person[]'].length; i++) {
			if(req.body['person[]'][i] === '') {

			} else {
				req.body.people.push(req.body['person[]'][i])
			}
			
		}
		 
		const createdEvent = await Event.create(req.body);
		//find the calendar we are adding our new event to. // 
		const foundCalendar = await Calendar.findById(req.body.calendarId)
		foundCalendar.events.push(createdEvent) 
		foundCalendar.save();

		//need to find which calendar the user is using
		const foundUser = await User.findById(req.session.userId);

		for(let i = 0; i < foundUser.calendars.length; i++) {
			if(foundUser.calendars[i].id === req.body.calendarId)
				foundUser.calendars[i].events.push(createdEvent);
		}

		foundUser.save();

	
		res.redirect('/user'); 

	} catch (err) {
		console.log(err, 'error with event create route')
	}
});


//EDIT EVENT ROUTE
router.get('/:id/edit', async (req, res) => {
	try {
		const foundEvent = await Event.findById(req.params.id);
		const foundCalendar = await Calendar.findById(foundEvent.calendarId);
		const foundUser = await User.findById(req.session.userId);

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
		console.log(req.body)

		const foundEvent = await Event.findById(req.params.id);

		//check if the calendar has been updated
		if(req.body.calendarId === foundEvent.calendarId) {
			console.log('calendar was not changed')
			//find and update the event in the event collection
			const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body);
			//find the calendar using the event
			const foundCalendar = await Calendar.findById(updatedEvent.calendarId);
			//find the user
			const foundUser = await User.findById(req.session.userId);

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
			foundUser.save();
		} else {
			console.log('calendar was changed')
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

			oldCalendar.save()
			//add the event to the new calendar
			newCalendar.events.push(updatedEvent);
			newCalendar.save()


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



		}

		res.redirect('/user');


	} catch (err) {
		console.log(err, 'error with event put route')
	}
})


router.delete('/:id', async (req, res) => {
	try {
		const foundEvent = await Event.findById(req.params.id);
		//find the event in the calendar and user collections
		const foundCalendar = await Calendar.find({'events.id': req.params.id});
		const foundUser = await User.find({'Calendars.id': foundCalendar.id});
		const calendarName = foundCalendar.name;

		//find the event in the User model and remove
		foundUser.Calendars.id(foundCalendar.id).events.id(foundEvent.id).remove();
		//find the event in the Calendar mondel and remove
		foundCalendar.events.id(foundEvent.id).remove();
		//save the User and Calendar models
		foundUser.save();
		foundCalendar.save()
		//find the event in the Event model and remove
		const deletedEvent = await Event.findByIdAndRemove(req.params.id);
		//redirect to the User's home page
		res.redirect('/users/' + req.params.id);

	} catch (err) {
		console.log(err, 'error with event delete route')
	}
})


//SHOW EVENT ROUTE
router.get('/:id', async (req, res) => {

	try {

		const foundEvent = await Event.findById(req.params.id);
		const foundCalendar = await Calendar.findById(foundEvent.calendarId);
		// const foundEvent = { name: 'Testing1',
  // 							 startDate: '2018-07-22',
  // 							 startTime: '03:00',
  // 							 endDate: '2018-07-22',
  // 							 endTime: '04:00',
  // 							 people: ['antying@gmail.com', 'something@gmail.com'],
  // 							 location: 'asdf',
  // 							 allDay: false };
		res.render('events/show.ejs', {
			event: foundEvent,
			calendar: foundCalendar
		})
	} catch (err) {
		console.log(err, 'error with event show route')
	}
})

module.exports = router;