//Select DOM
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const mainText = document.getElementById('main-text');
const resetButton = document.getElementById('reset-button');

//Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteTodo);
filterOption.addEventListener('click', filterTodo);
resetButton.addEventListener('click', resetX);
//username
let userName = '';
//Todo list
let todos = [];
//url
let url = 'http://localhost:3000/';

//Functions
//RESET
async function resetX(){
	localStorage.removeItem("user");
	await fetch(url, {
		method: 'DELETE',
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

//CREATE
async function addTodo(e) {
	//Prevent natural behaviour
	e.preventDefault();
	location.reload();
	//Create todo div
	const todoDiv = document.createElement('div');
	todoDiv.classList.add('todo');
	//Create list
	const newTodo = document.createElement('li');
	newTodo.innerText = todoInput.value;
	//prepare the request body
	let data = { title: `${newTodo.innerText}` };
	//send a post request
	await fetch(url, {
		method: 'POST', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => {
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
	const targetUrl = url + item.parentElement.id;
	if (item.classList[0] === 'trash-btn') {
		// e.target.parentElement.remove();
		const todo = item.parentElement;
		todo.classList.add('fall');
		//at the end
		//removeLocalTodos(todo);
		await fetch(targetUrl, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then((data) => {
				//console.log(data);
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

		if (todo.classList[2] == null) {
			await fetch(targetUrl, {
				method: 'PATCH', // or 'PUT'
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ done: true }),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Success:', data);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
			todo.classList.add('completed');
		} else if (todo.classList[2] != null) {
			await fetch(targetUrl, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ done: false }),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Success:', data);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
			todo.classList.remove('completed');
		}
	}

	if (item.classList.contains('todo') || item.classList.contains('todo-item')) {
		let target = item.parentElement;

		if (target.classList.contains('normal')) {
			target.className = target.className.replace(
				/(?:^|\s)normal(?!\S)/g,
				' important'
			);
			await fetch(targetUrl, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ difficulty: 'important' }),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Success:', data);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
				console.log(target);
		} else if (target.classList.contains('important')) {
			target.className = target.className.replace(
				/(?:^|\s)important(?!\S)/g,
				' not-important'
			);
			await fetch(targetUrl, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ difficulty: 'not-important' }),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Success:', data);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
				console.log(target);
		} else if (target.classList.contains('not-important')) {
			target.className = target.className.replace(
				/(?:^|\s)not-important(?!\S)/g,
				' normal'
			);
			await fetch(targetUrl, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ difficulty: 'normal' }),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Success:', data);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
				console.log(target);
		}
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

async function getTodos(e) {
	e.preventDefault();
	//get name

	if (!localStorage.getItem('user')) {
		mainText.innerHTML = window.prompt('Whats your name?', 'Jason');
		localStorage.setItem('user', mainText.innerHTML);
		console.log(localStorage.getItem('user'));
	} else {
		mainText.innerHTML = localStorage.getItem('user');
	}

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
				todoDiv.classList.add('todo', 'normal');
				todoDiv.id = el._id;
				if (el.done == true && todoDiv.classList[2] == null) {
					todoDiv.classList.add('completed');
				}
				if (el.difficulty == 'important') {
					todoDiv.className = todoDiv.className.replace(
						/(?:^|\s)normal(?!\S)/g,
						' important'
					);
				} else if (el.difficulty == 'not-important') {
					todoDiv.className = todoDiv.className.replace(
						/(?:^|\s)normal(?!\S)/g,
						' not-important'
					);
				}
				//Create list
				const newTodo = document.createElement('li');
				newTodo.innerText = el.title;
				newTodo.classList.add('todo-item');
				todoDiv.appendChild(newTodo);
				todoInput.value = '';
				//create a time div
				const timeDiv = document.createElement('div');
				timeDiv.classList.add('time-div');
				timeDiv.innerHTML = formatDate(Date.parse(el.datum));
				todoDiv.appendChild(timeDiv);
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
function formatDate(d) {
	let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
	let da = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(d);
	let ho = new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(d);
	let mi = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
	let newDate = `${da}, ${ho}`;
	return newDate;
}

function checkUser() {
	if (!localStorage.getItem('user')) {
		mainText.innerHTML = localStorage.setItem(
			'user',
			window.prompt('Whats your name?', 'Jason')
		);
	} else if (
		localStorage.getItem('user') &&
		localStorage.getItem('user') == u
	) {
		mainText.innerHTML = u;
	} else {
		console.log('JEEEEZZZ');
	}
}
