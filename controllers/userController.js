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
      });

    }

  } catch(err) {

      console.log(err, 'error with the user home route')
      res.send(err)
    }
  
});
/////////////////////////


/////////////////////////
// USER REGISTER ROUTE // 
router.post('/register', async (req, res) => {
  try {
    const registerUser = await User.find({});
    res.render('user/login.ejs', {
      user: registerUser
    }); 

  } catch(err) {

    console.log(err, 'error with the user register route')
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
router.post('/:id/preferences', async (req, res) => {
  
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

    console.log(err, 'error with delete route')
    res.send(err)
  }

})



/////////////////////////
// EXPORT ROUTER // 
module.exports = router; 
/////////////////////////