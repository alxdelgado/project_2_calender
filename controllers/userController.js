const express = require('express');
const router = express.Router(); 

const User = require('../models/user');
const Event = require('../models/event');
const Calendar = require('../models/calendar'); 


/////////////////////////
// USER INDEX ROUTE // 
router.get('/', async (req, res) => {
  
  try {


    if(req.session.loggedIn === true) {
      res.redirect('/user/' + req.session.userId)
    } else {
      res.render('user/login.ejs', {
        message: req.session.message
      });

    }

  } catch(err) {

      console.log(err, 'error with the user home route')
      res.send(err)
    }
  
});
/////////////////////////


/////////////////////////
// PREFERENCES ROUTE // 
router.get('/:id/preferences', async (req, res) => {
  try {

    const foundUser = await User.findById(req.params.id);
    res.render('user/preference.ejs', {
      user: foundUser
    })

  } catch(err) {

    console.log(err, 'error with the user preference route')
    res.send(err)

  }

});
/////////////////////////
// Update User // 
router.put('/:id/preferences', async (req, res) => {
  
  try {

    const updatedUser = await User.findById(req.params.id);
    updatedUser.preference = req.body.preference; 
    updatedUser.save(); 
    res.redirect('/user'); 


  } catch(err) {

    console.log(err, 'error with the update user route');
    res.send(err)

  }

});

/////////////////////////
// DELETE ROUTE // 
router.delete('/:id', async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    for(let i = 0; i < foundUser.calendars.length; i++){
      for(let j = 0; j < foundUser.calendars[i].events.length; j++){
        const deletedEvent = await Event.findByIdAndRemove(foundUser.calendars[i].events[j].id)
      }

      const deletedCalendar = await Calendar.findByIdAndRemove(foundUser.calendars[i].id)

    }

    const deletedUser = await User.findByIdAndRemove(foundUser.id)
    res.redirect('/auth/logout');


  } catch(err) {

    console.log(err, 'error with delete route');
    res.send(err);

  }

}); 

////////////////////////

router.get('/:id', async (req, res) => {
  try {

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();

    res.redirect(`/user/${req.session.userId}/${month}/${year}`)

  } catch (err) {
    console.log(err, 'error with user show route');
  }
})


////////////////////////
// SHOW ROUTE //
router.get('/:id/:month/:year', async (req, res) => {
  try {
    const foundUser = await User.findById(req.session.userId);
    const allCalendars = await Calendar.find({'userId': req.session.id});
    const allEvents = [];

    for(let i = 0; i < allCalendars.length; i++) {
      const foundEvents = await Event.find({'calendarId': allCalendars[i].id})
      allEvents.push(foundEvents);
    }

    if(req.params.id !== req.session.userId) {
      res.redirect('/user/' + req.session.userId);
    } else {
      res.render('user/home.ejs', {
        user: foundUser,
        calendars: allCalendars, 
        events: allEvents, 
        month: req.params.month,
        year: req.params.year
      })
    }

  } catch (err) {
    console.log(err, 'error with user show route');
  }
})

/////////////////////////





/////////////////////////
// EXPORT ROUTER // 
module.exports = router; 
/////////////////////////