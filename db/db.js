const mongoose = require('mongoose');

// Heroku // 
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/calendar_GA_PROJECT';

mongoose.connect(mongoUri);


mongoose.connection.on('connected', () => {
	console.log('mongoose is connected to mongoDB');
});

mongoose.connection.on('error', (err) => {
	console.log(err, 'error connecting with mongoDB');
});

mongoose.connection.on('disconnected', () => {
	console.log('mongoose was disconnected from mongoDB');
});

