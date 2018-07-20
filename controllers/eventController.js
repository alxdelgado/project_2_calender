const express = require('express');
const router = express.Router();


const User = require('../models/user');


const Event = require('../models/event');


//NEW EVENT ROUTE
router.get('/new', async (req, res) => {
	const foundUser = await User.findById(req.sessions.userId);
	res.render('/events/new.ejs', {
		user: foundUser
	});
});








module.exports = router;