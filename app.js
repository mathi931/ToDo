const express = require('express');
const app = express();
const cors = require('cors');
const router = express.Router();
const db = require('mongoose');
const Todo = require('./models/todoModel');
require('dotenv/config');

//MIDDLEWARES
app.use(cors());
app.use('/', express.json());

//CONNECT TO THE DB
db.connect(process.env.DB_CON, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
//TEST CONNECTION
db.connection
	.once('open', () => {
		console.log('connected to the DB');
	})
	.on('error', (err) => {
		console.log(`connection error: ${err}`);
	});

//***ROUTES***//

//GET ALL TODOS
app.get('/all', async (req, res) => {
	try {
		const todos = await Todo.find();
		res.json(todos);
	} catch (err) {
		res.json({ message: error });
	}
});

//CREATE A TODO
app.post('/new', async (req, res) => {
	const toDo = new Todo({
		title: req.body.title,
		description: req.body.description,
	});
	try {
		const savedToDo = await toDo.save();
		res.json(savedToDo);
	} catch (error) {
		res.json({ message: error });
	}
});

//DELETE TO DO
app.delete('/:todoId', async (req, res) => {
	try {
		const removeToDo = await Todo.remove({ _id: req.params.todotId });
		res.json(removeToDo);
	} catch (error) {
		res.json({ message: error });
	}
});

//UPDATE TODO
app.patch('/:todoId', async (req, res) => {
	try {
		const updatedToDo = await Todo.updateOne(
			{ _id: req.params.todoId },
			{ $set: { title: req.body.title } },
			{ $set: { description: req.body.description } }
		);
		res.json(updatedToDo);
	} catch (error) {
		res.json({ message: error });
	}
});
//***ROUTES***//

//SERVER LISTENING ON PORT:
app.listen(3000, () => {
	console.log('server is listening on port 3000');
});
