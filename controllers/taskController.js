const express = require('express'); 
const router = express.Router(); 

const User = require('../models/user');
const Task = require('../models/task');


// making middleware to redirect to login page unless user is logged in
router.use((req, res, next) => {

  // console.log(req.session.cookie.path)
  if(!req.session.logged) {
    res.redirect('/user/login') //adjust home page to whatever the main loading page is
  } else {
    next();
  }
})


// NEW ROUTE // 
router.get('/new', async (req, res) => {
  try { 
    const findUser = await User.findById(req.session.userId);
    res.render('tasks/new.ejs', {
      user: findUser
    });
  } catch(err) {
    res.send(err); 
  }
});


// EDIT ROUTE // 
router.get('/:id/edit', async (req, res) => {
  try {
    const findUser = await User.findById(req.session.userId);
    res.render('tasks/edit.ejs', {
      user: findUser
    }); 
  } catch(err) {
    res.send(err); 
  }
});

// PUT/UPDATE ROUTE // 
router.put('/:id', async (req, res) => {

  try {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body); 
  res.redirect('/tasks/new');

  } catch(err) {
    res.send(err)
  }
});


// CREATE ROUTE // 
router.post('/', async (req, res) => {
  try {
    const createdTask = await Task.create(req.body);
    const foundUser = await User.findById(req.session.userId); 
    foundUser.openTasks.push(createdTask); 
    foundUser.save();

    res.redirect('/user')
  } catch(err) {
    res.send(err); 
  }
});


// DELETE ROUTE //
router.delete('/', async (req, res) => {
  try {
    const deletedTask = await User.findByIdAndRemove(req.params.id);
    res.render('task/archive.ejs', {
      user: deletedTask
    })
  } catch(err) {
    res.send(err)
  }
});

// EXPORT ROUTER //
module.exports = router;
