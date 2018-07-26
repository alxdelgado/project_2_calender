const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');
const Calendar = require('../models/calendar');





// Make middleware to redirect to login unless user is logged in. // 
router.use((req, res, next) => {
	// console.log('getting here')
  if(req.session.logged !== true) {
  	res.redirect('/user')
  } else {
  	next(); 
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

// INDEX CALENDAR ROUTE
router.get('/', async (req, res) => {
	try {
		//find user
		const foundUser = await User.findById(req.session.userId);
		//render index page 
		res.render('calendars/index.ejs', {
			user: foundUser
		})


	} catch (err) {
		console.log(err, 'error with calendar index route')
	}



})

// CREATE CALENDAR ROUTE
router.post('/', async (req, res) => {
	try{
		const foundUser = await User.findById(req.session.userId);
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
		
		res.redirect('/user')
	} catch (err) {
		console.log(err, 'error with create calendar route')
	}
});


//EDIT CALENDAR ROUTE
// router.get('/:id/edit', async (req, res) => {
// 	try {
// 		const foundCalendar = await Calendar.findById(req.params.id);
// 		res.render('calendars/edit.ejs', {
// 			calendar: foundCalendar, 
// 			uniqueColor: false
// 		});

// 	} catch (err) {
// 		console.log(err, 'error with edit calendar route');
// 	}
// });


//UPDATE CALENDAR ROUTE
router.put('/:id', async (req, res) => {
	//check if calendar color has been used by User before.
	try {
		const foundUser = await User.findById(req.session.userId);
		const foundCalendar = await Calendar.findById(req.params.id);
		for (let i = 0; i < foundUser.calendars.length; i++) {
			if(req.body.color === foundUser.calendars[i].color) {
				if(req.params.id !== foundUser.calendars[i].id){
					res.render('calendars/edit.ejs', {
						calendar: foundCalendar,
						uniqueColor: true
					});
				}
			}
		}

		for(let i = 0; i < foundUser.calendars.length; i++) {
			if(foundUser.calendars[i].id === req.params.id) {
				foundUser.calendars[i].name = req.body.name;
				foundUser.calendars[i].color = req.body.color;
			}
		}
		foundUser.save();

		foundCalendar.name = req.body.name;
		foundCalendar.color = req.body.color;
		foundCalendar.save();
		res.redirect('/user');

	} catch (err) {
		console.log(err, 'error with update calendar route')
	}

});


//DELETE CALENDAR ROUTE
router.delete('/:id', async (req, res) => {
	try {
		const foundCalendar = await Calendar.findById(req.params.id);
		const calendarID = foundCalendar.id;
		//loop through all the events in the calendar and delete them
		for(let i = 0; i < foundCalendar.events.length; i++) {
			const deletedEvent = await Event.findByIdAndRemove(foundCalendar.events[i].id);
		}

		//find user and delete calendar from calendars array
		const foundUser = await User.findById(req.session.userId);
		// console.log(foundUser, 'this is before calendar removal')

		// for(let i = 0; i < foundUser.calendars.length; i++) {
		// 	if(foundUser.calendars[i].id === foundCalendar.id) {
		// 		const deletedCalendar = foundUser.calendars.splice(i, 1);
		// 	}
		// }
		foundUser.calendars.id(foundCalendar.id).remove()
		await foundUser.save();

		// console.log(foundUser, 'this is after calendar removal')
		// await foundCalendar.save();

		//delete the calendar from Calendar model
		const deletedCalendar = await Calendar.findByIdAndRemove(req.params.id);

		res.redirect('/user');


	} catch (err) {
		console.log(err, 'error with delete calendar route')
	}
});





module.exports  = router;