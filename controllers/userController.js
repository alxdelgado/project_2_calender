const express = require('express');
const router = express.Router(); 

const User = require('../models/user'); 


/////////////////////////
// HOME/INDEX ROUTE // 
router.get('/', async (req, res) => {
  try {

    const foundUser = await User.find({}); 
    res.render('user/home.ejs', {
      user: foundUser
    });

  } catch(err) {

    console.log(err, 'error with home route')

  }

}); 
/////////////////////////





/////////////////////////
// EXPORT ROUTER // 
module.exports = router; 
/////////////////////////