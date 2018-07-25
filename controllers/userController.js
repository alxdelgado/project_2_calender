const express = require('express');
const router = express.Router(); 
const nodeCalendar = require('node-calendar');

const User = require('../models/user');
const Event = require('../models/event');
const Calendar = require('../models/calendar'); 

router.get('/calenderTest', (req, res) => {

  nodeCalendar.setlocale('en_US');
  console.log(nodeCalendar.day_name);
  
  const cal = nodeCalendar.Calendar();

  res.send(cal);
  
})



/////////////////////////
// USER INDEX ROUTE // 
router.get('/', async (req, res) => {
  
  try {

    if(req.session.logged === true) {
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
    res.redirect('/user/'); 


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

    res.redirect(`/user/${req.session.userId}/${year}/${month}`)

  } catch (err) {
    console.log(err, 'error with user show route');
  }
})


////////////////////////
// SHOW ROUTE //
router.get('/:id/:year/:month', async (req, res) => {
  try {

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let monthNumber = '' 

    for(let i = 0; i < monthNames.length; i++) {
      if(monthNames[i] === req.params.month) {
        monthNumber = i + 1;
      }
    } 



      //ensure the url path is an actual month
      if(monthNumber === '') {
        res.redirect('/user/' + req.session.userId);
      } else{

        const yearNumber = parseInt(req.params.year);
        const prevYear = yearNumber - 1;
        const nextYear = yearNumber + 1;

        let prevMonthNumber;
        let prevMonthName;
        let nextMonthNumber;
        let nextMonthName;
        let prevMonthYear;
        let nextMonthYear;

        if(monthNumber === 1) {
          prevMonthNumber = 12;
          prevMonthName = 'December';
          nextMonthNumber = 2;
          nextMonthName = 'February';
          prevMonthYear = yearNumber - 1;
          nextMonthYear = yearNumber;

        } else if (monthNumber === 12) {
          prevMonthNumber = 11;
          prevMonthName = 'November';
          nextMonthNumber = 1;
          nextMonthName = 'January';
          prevMonthYear = yearNumber;
          nextMonthYear = yearNumber + 1;
        } else {
          prevMonthNumber = monthNumber - 1;
          prevMonthName = monthNames[prevMonthNumber - 1];
          nextMonthNumber = monthNumber + 1;
          nextMonthName = monthNames[nextMonthNumber - 1];
          prevMonthYear = yearNumber;
          nextMonthYear = yearNumber;
        }



        //get the starting weekday of the month and the number of days in the month
        const monthRange = nodeCalendar.monthrange(yearNumber, monthNumber);
        let startDay = monthRange[0] + 1
        if(startDay === 7) {
          startDay = 0;
        }

        let monthDays = monthRange[1];

      
        const foundUser = await User.findById(req.session.userId);
        const allCalendars = foundUser.calendars;
        const allEvents = [];
        
  
        for(let i = 0; i < allCalendars.length; i++) {
          const foundEvents = await Event.find({'calendarId': allCalendars[i].id})
          allEvents.push(foundEvents);
        }


        const currentEvents = [];

        //checking if event start date matches the month and year of the url
        for(let i = 0; i < allCalendars.length; i++) {
          for(let j = 0; j < allEvents[i].length; j++) {
            const yearSlice = allEvents[i][j].startDate.slice(0, 4);
            const monthSlice = allEvents[i][j].startDate.slice(5, 7);
            if(yearSlice == yearNumber && monthSlice == monthNumber) {
              currentEvents.push(allEvents[i][j]);
            }
          }
        }
  
        if(req.params.id !== req.session.userId) {
          res.redirect('/user/' + req.session.userId);
        } else {
          //console.log(foundUser, allCalendars, currentEvents, monthNumber, yearNumber, startDay, monthDays);
          res.render('user/home.ejs', {
            user: foundUser,
            calendars: allCalendars, 
            events: currentEvents, 
            monthName: req.params.month,
            monthNumber: monthNumber,
            year: yearNumber,
            startDate: startDay,
            monthDays: monthDays,
            dayNames: dayNames, 
            prevYear: prevYear,
            nextYear: nextYear,
            prevMonthName: prevMonthName,
            nextMonthName: nextMonthName,
            prevMonthYear: prevMonthYear,
            nextMonthYear: nextMonthYear
          })
      }
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