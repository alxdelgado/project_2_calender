const express = require('express');
const router = express.Router(); 

const User = require('../models/user'); 


/////////////////////////
// HOME/INDEX ROUTE // 
router.get('/', async (req, res, next) => {
  try {

    const foundUser = await User.find({}); 
    res.render('/home.ejs', {
      user: foundUser
    });

  } catch(err) {

    next(err)

  }

}); 
/////////////////////////





/////////////////////////
// EXPORT ROUTER // 
module.exports = router; 
/////////////////////////