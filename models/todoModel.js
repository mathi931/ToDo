const db = require('mongoose');

const ToDoSchema = new db.Schema({
	title: String,
	description: String,
});

module.exports = db.model('Todos', ToDoSchema);
