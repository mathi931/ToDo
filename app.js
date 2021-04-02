const express = require('express');
const app = express();
const db = require('mongoose');
require('dotenv/config');

db.connect(process.env.DB_CON, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

db.connection
	.once('open', () => {
		console.log('connected to the DB');
	})
	.on('error', (err) => {
		console.log(`connection error: ${err}`);
	});

app.listen(3000);