const express = require('express');
const app = express();

const db = require('mongoose');
const Todo = require('./models/todoModel');
const cors = require('cors');
require('dotenv/config');

//MIDDLEWARES
// app.use(express.static('landingpage'));
app.use(express.json());
app.use(cors());

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
app.get('/', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
	try {
		const todos = await Todo.find();
		res.status(200).json(todos);
	} catch (err) {
		res.status(400).json({ message: error });
	}
});

//CREATE A TODO
app.post('/', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
	const toDo = new Todo({
		title: req.body.title,
	});
	try {
		const savedToDo = await toDo.save();

		res.status(200).json(savedToDo);
	} catch (error) {
		res.status(400).json({ message: error });
	}
});

//DELETE TO DO
app.delete('/:id', async (req, res) => {
	try {
		const removeToDo = await Todo.deleteOne({ _id: req.params.id });
		res.status(200).json(removeToDo);
	} catch (error) {
		res.status(400).json({ message: error });
	}
});

//UPDATE TODO
app.patch('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const response = await Todo.findByIdAndUpdate(id, req.body, {
			new: true,
		}).exec();
		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		res.status(400).send({ message: error });
	}
});

// router.put('/', checkIfAuthenticated, async (req, res) => {
//     const uid = req.authId;

//     try {
//       const response = await UserColl.findByIdAndUpdate(uid, req.body, {
//         new: true,
//       }).exec();
//       res.status(200).json(response);
//     } catch (error) {
//       console.log(error);
//       res.status(400).json(error);
//     }
//   });
//***ROUTES***//

//SERVER LISTENING ON PORT:
app.listen(3000, () => {
	console.log('server is listening on port 3000');
});
