//Require files and modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');

const port = 7000;

require('./db/db');

//add controllers here
const eventController = require('./controllers/eventController');
const userController = require('./controllers/userController');
const calendarController = require('./controllers/calendarController');
const authController = require('./controllers/authController');



//setup session
app.use(session({
	secret: '9fajdf9urajdkfaskfjaijfasfjahsdflasfhauiuriwfkjafaf',
	resave: false, //only save when the session object has been modified
	saveUninitialized: false //user for login sessions, we only want to save when we modify the session
})); 


//MiddleWare
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));




//use controllers here
app.use('/events', eventController);
app.use('/user', userController);
app.use('/calendar', calendarController);
app.use('/auth', authController); 


// login // 
app.get('/', (req, res,) => {
  res.redirect('/user')  
});


app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`);
})




