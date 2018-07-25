// Long/Authorization Controller //

const express = require('express');
const router = express.Router(); 
const User = require('../models/user')

// Require bcrypt // 
const bcrypt = require('bcrypt'); 

// Register route // 
router.post('/register', async (req, res) => {
  try{

    const password = req.body.password;
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Create an object to enter into the User model. 
    const userDbEntry = {};
    userDbEntry.username = req.body.username;
    userDbEntry.password = passwordHash;
    userDbEntry.calendars = [];

    // Create an entry into the database. 
  
    const createdUser = await User.create(userDbEntry);
    req.session.userId = createdUser.id;
    req.session.username = createdUser.username; 
    req.session.logged = true;
    res.redirect('/user/' + req.session.userId /* + '/preferences'*/)  
  
  } catch (err) {
    console.log(err, 'error with login register route')
  }
});



// Login // 
router.post('/login', (req, res) => {
  User.findOne ({username: req.body.username}, (err, user) => {
    if(user){
      // If the user is found. 
      if(bcrypt.compareSync(req.body.password, user.password)){
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.logged = true; 
        res.redirect('/user/' + req.session.userId)

      } else {
        req.session.message = 'Username or password is incorrect'; 
        res.redirect('/user')
      }
    } else {
        req.session.message = 'Username or password is incorrect'; 
        res.redirect('/user')
    }
  
  });
});


// Logging out // 
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      res.send('error destroying session')
    } else {
      res.redirect('/user')
    }
  
  });

});

module.exports = router;

