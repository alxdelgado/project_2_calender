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
// USER NEW ROUTE // 
router.get('/', (req, res) => {
    

})




/////////////////////////
// EXPORT ROUTER // 
module.exports = router; 
/////////////////////////