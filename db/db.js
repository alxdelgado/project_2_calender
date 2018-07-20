const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/calendar');


mongoose.connection.on('connected', () => {
	console.log('mongoose is connected to mongoDB');
});

mongoose.connection.on('error', (err) => {
	console.log(err, 'error connecting with mongoDB');
});

mongoose.connection.on('disconnected', () => {
	console.log('mongoose was disconnected from mongoDB');
});