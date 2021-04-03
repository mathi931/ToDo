//Select DOM
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

//Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteTodo);
filterOption.addEventListener('click', filterTodo);

//Todo list
let todos = [];
//url
let url = 'http://localhost:3000/';


//Functions

async function addTodo(e) {
	//Prevent natural behaviour
	e.preventDefault();
	//Create todo div
	const todoDiv = document.createElement('div');
	todoDiv.classList.add('todo');
	//Create list
	const newTodo = document.createElement('li');
	newTodo.innerText = todoInput.value;
	//prepare the request body
	let data = { title: `${newTodo.innerText}`};
	//send a post request 
	await fetch(url, {
		method: 'POST', // or 'PUT'
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	  })
	  .then(response => response.json())
	  .then(data => {
		todos.push(data);
		todoDiv.id = data._id;
	  })
	  .catch((error) => {
		console.error('Error:', error);
	  });
	//Save to local - do this last
	//Save to local
	//saveLocalTodos(todoInput.value);
	//
	newTodo.classList.add('todo-item');
	todoDiv.appendChild(newTodo);
	todoInput.value = '';
	//Create Completed Button
	const completedButton = document.createElement('button');
	completedButton.innerHTML = `<i class="fas fa-check"></i>`;
	completedButton.classList.add('complete-btn');
	todoDiv.appendChild(completedButton);
	//Create trash button
	const trashButton = document.createElement('button');
	trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
	trashButton.classList.add('trash-btn');
	todoDiv.appendChild(trashButton);
	//attach final Todo
	todoList.appendChild(todoDiv);

	
}

async function deleteTodo(e) {
	const item = e.target;
	const targetUrl = url+item.parentElement.id;
	console.log(targetUrl);
	if (item.classList[0] === 'trash-btn') {
		// e.target.parentElement.remove();
		const todo = item.parentElement;
		todo.classList.add('fall');
		//at the end
		//removeLocalTodos(todo);
		await fetch(targetUrl, {
			method: 'DELETE'
		  })
		  .then(response => response.json())
		  .then(data => {
			console.log(data);
		  })
		  .catch((error) => {
			console.error('Error:', error);
		  });

		todo.addEventListener('transitionend', (e) => {
			todo.remove();
		});
	}
	if (item.classList[0] === 'complete-btn') {
		const todo = item.parentElement;
		todo.classList.toggle('completed');
		console.log(todo);
	}
}

function filterTodo(e) {
	const todos = todoList.childNodes;
	todos.forEach(function (todo) {
		switch (e.target.value) {
			case 'all':
				todo.style.display = 'flex';
				break;
			case 'completed':
				if (todo.classList.contains('completed')) {
					todo.style.display = 'flex';
				} else {
					todo.style.display = 'none';
				}
				break;
			case 'uncompleted':
				if (!todo.classList.contains('completed')) {
					todo.style.display = 'flex';
				} else {
					todo.style.display = 'none';
				}
		}
	});
}

function saveLocalTodos(todo) {
	let todos;
	if (localStorage.getItem('todos') === null) {
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem('todos'));
	}
	todos.push(todo);
	localStorage.setItem('todos', JSON.stringify(todos));
}
function removeLocalTodos(todo) {
	let todos;
	if (localStorage.getItem('todos') === null) {
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem('todos'));
	}
	const todoIndex = todo.children[0].innerText;
	todos.splice(todos.indexOf(todoIndex), 1);
	localStorage.setItem('todos', JSON.stringify(todos));
}

async function getTodos(e) {

	e.preventDefault();
	fetch('http://localhost:3000/', {
		method: 'GET',
	})
		.then((response) => response.json())
		.then((data) => {
			data.forEach((el) => {
				//Put the data into the array
				todos.push(el);
				//Create todo div
				const todoDiv = document.createElement('div');
				todoDiv.classList.add('todo');
				todoDiv.id = el._id;
				//Create list
				const newTodo = document.createElement('li');
				newTodo.innerText = el.title;
				newTodo.classList.add('todo-item');
				todoDiv.appendChild(newTodo);
				todoInput.value = '';
				//Create Completed Button
				const completedButton = document.createElement('button');
				completedButton.innerHTML = `<i class="fas fa-check"></i>`;
				completedButton.classList.add('complete-btn');
				todoDiv.appendChild(completedButton);
				//Create trash button
				const trashButton = document.createElement('button');
				trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
				trashButton.classList.add('trash-btn');
				todoDiv.appendChild(trashButton);
				//attach final Todo
				todoList.appendChild(todoDiv);
			});
		})
		.catch((error) => {
			console.error('Error:', error);
		});
		console.log(todos);
}
