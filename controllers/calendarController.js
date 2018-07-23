const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');
const Calendar = require('../models/calendar');


// Make middleware to redirect to login unless user is logged in. // 
router.use('/login', (req, res, next) => {
	console.log('getting here')
  if(!req.session.logged) {
  	res.redirect('/user/login')
  } else {
  	next(err); 
  }

}); 


//NEW CALENDAR ROUTE
router.get('/new', async (req, res) => {
	try {
		const foundUser = await User.findById(req.session.userId); 
		res.render('calendars/new.ejs', {
			uniqueColor: false, 
			user: foundUser
		});
	} catch(err) {

		console.log(err, 'error with new calendar route');
		res.send(err); 

	}
});

// CREATE CALENDAR ROUTE
router.post('/', async (req, res) => {
	try{
		const foundUser = await User.findById(req.session.userId);
		console.log(foundUser)
		for (let i = 0; i < foundUser.calendars.length; i++) {
			if(req.body.color === foundUser.calendars[i].color) {
				res.render('calendar/new.ejs', {
					uniqueColor: true
				});
			}
		}
		//add empty array to req.body
		req.body.events = [];
		//add userId to req.body
		req.body.userId = req.session.userId;
		//create new Calendar entry
		const newCalendar = await Calendar.create(req.body);
		//push new calendar entry to current user
		foundUser.calendars.push(newCalendar)
		foundUser.save();
		
		res.redirect('/users')
	} catch (err) {
		console.log(err, 'error with create calendar route')
	}
});


//EDIT CALENDAR ROUTE
router.get('/:id/edit', async (req, res) => {
	try {
		const foundCalendar = await Calendar.findById(req.params.id);
		res.render('calendars/edit.ejs', {
			calendar: foundCalendar, 
			uniqueColor: false
		});

	} catch (err) {
		console.log(err, 'error with edit calendar route');
	}
});


//UPDATE CALENDAR ROUTE
router.put('/:id', async (req, res) => {
	//check if calendar color has been used by User before.
	try {
		const foundUser = await User.findById(req.session.userId);
		const foundCalendar = await Calendar.findById(req.params.id);
		for (let i = 0; i < foundUser.Calendars.length; i++) {
			if(req.body.color === foundUser.Calendars[i].color) {
				res.render('calendars/edit.ejs', {
					calendar: foundCalendar,
					uniqueColor: true
				});
			}
		}

		foundCalendar.name = req.body.name;
		foundCalendar.color = req.body.color;
		foundCalendar.save();
		res.redirect('/users');

	} catch (err) {
		console.log(err, 'error with update calendar route')
	}

});


//DELETE CALENDAR ROUTE
router.delete('/:id', async (req, res) => {
	try {
		const foundCalendar = Calendar.findById(req.params.id);
		//loop through all the events in the calendar and delete them
		for(let i = 0; i < foundCalendar.events.length; i++) {
			const deletedEvent = await Event.findByIdAndRemove(foundCalendar.event[i].id);
		}

		//delete the calendar
		const deletedCalendar = await Calendar.findByIdAndRemove(req.params.id);

		res.redirect('/users');


	} catch (err) {
		console.log(err, 'error with delete calendar route')
	}
});


module.exports  = router;