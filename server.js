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



//making middleware to redirect to login page unless user is logged in
// app.use((req, res, next) => {

// 	console.log(req.session.cookie.path)
// 	if(!req.session.logged && req.session.cookie.path !== '/') {
// 		res.redirect('/user/') //adjust home page to whatever the main loading page is
// 	} else {
// 		next();
// 	}
// })

//use controllers here
app.use('/events', eventController);
app.use('/user', userController);


app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`);
})




