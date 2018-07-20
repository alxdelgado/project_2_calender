const express = require('express');
const router = express.Router(); 

const User = require('../models/user'); 


/////////////////////////

// USER INDEX ROUTE // 
router.get('/', async (req, res) => {
  try {

    const foundUser = await User.find({}); 
    res.render('user/home.ejs', {
      user: foundUser
    });

  } catch(err) {

    console.log(err, 'error with the user home route'); 

  }

}); 
/////////////////////////

/////////////////////////
// USER LOGIN ROUTE // 
router.get('/', async (req, res) => {
    try {
      const loginUser = await User.find({}); 
      res.render('user/login.ejs', {
      });

    } catch(err) {

      console.log(err, 'error with the user login route')

    }

});
/////////////////////////


/////////////////////////
// USER REGISTER ROUTE // 
router.get('/', async (req, res) => {
  try {
    const registerUser = await User.find({});
    res.render('user/register.ejs', {
    }); 

  } catch(err) {

    console.log(err, 'error with the user register route ')

  }

});




/////////////////////////
// EXPORT ROUTER // 
module.exports = router; 
/////////////////////////