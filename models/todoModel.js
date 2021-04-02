const db = require('mongoose');

const ToDoSchema = new db.Schema({
	title: {
		type: String,
		required: true,
		min: 6,
	},
	done: {
		type: Boolean,
		default: false,
	},
});

module.exports = db.model('Todos', ToDoSchema);
