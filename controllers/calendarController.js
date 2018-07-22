const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Event = require('../models/event');


//NEW CALENDAR ROUTE
router.get('/new', async (req, res) => {
	// const foundUser = await User.findById(req.sessions.userId);
	// res.render('/events/new.ejs', {
	// 	user: foundUser
	// });

	res.render('calendars/new.ejs', {
		uniqueColor: false
	});
});


//CREATE CAlENDAR ROUTE
router.post('/', async (req, res) => {
	try{
		const foundUser = await User.findById(req.session.userId);
		for (let i = 0; i < foundUser.Calendars.length; i++) {
			if(req.body.color === foundUser.Calendars[i].color) {
				res.render('calendars/new.ejs', {
					uniqueColor: true
				})
			}
		}
		//add empty array to req.body
		req.body.events = [];
		//add userId to req.body
		req.body.userId = req.session.userId;
		//create new Calendar entry
		const newCalendar = await Calendar.create(req.body);
		//push new calendar entry to current user
		foundUser.calendars.push(req.body)
		foundUser.save();
		
		res.redirect('/users')
	} catch (err) {
		console.log(err, 'errow with create calendar route')
	}
})

module.exports  = router;