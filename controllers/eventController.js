const express = require('express');
const router = express.Router();


const User = require('../models/user');


const Event = require('../models/event');

// making middleware to redirect to login page unless user is logged in
router.use((req, res, next) => {

	// console.log(req.session.cookie.path)
	if(!req.session.logged) {
		res.redirect('/user') //adjust home page to whatever the main loading page is
	} else {
		next();
	}
})

//NEW EVENT ROUTE
router.get('/new', async (req, res) => {
	const foundUser = await User.findById(req.sessions.userId);
	res.render('/events/new.ejs', {
		user: foundUser
	});
});








module.exports = router;