const express = require('express'); 
const router = express.Router(); 

const User = require('../models/user');
const Task = require('../models/task');


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
router.delete('/:id', async (req, res) => {

  try {
    const foundUser = await User.findById(req.session.userId);
    const foundTask = await Task.findById(req.params.id);
    for(let i = 0; i < foundUser.openTasks.length; i++){
      if(foundUser.openTasks[i].id === foundTask.id){
        const removedTask = foundUser.openTasks.splice(i, 1); 
      }

    } 
   
    const deleteTask = await Task.findByIdAndRemove(req.params.id);
    await foundUser.save(); 
    res.redirect('/user')
  
  } catch(err) {
    res.send(err)
  }
});

// EXPORT ROUTER //
module.exports = router;

























