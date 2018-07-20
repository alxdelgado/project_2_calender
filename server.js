//Require files and modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');


const userController = require('./controllers/userController');
const eventController = require('./controllers/eventController');
const calendarController = require('./controllers/calendarController');
const taskController = require('./controllers/taskController');

const port = 7000;

require('./db/db');


//setup session
app.use(session({
	secret: '9fajdf9urajdkfa skfj aijfasfjahsdflasfhauiuriw fkja faf',
	resave: false, //only save when the session object has been modified
	saveUninitialized: false //user for login sessions, we only want to save when we modify the session
}));


//MiddleWare
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.use('/user', userController);
app.use('/event', eventController);
app.use('/task', taskController);
app.use('/calendar', calendarController);


app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`);
})




