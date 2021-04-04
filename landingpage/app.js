//**DOMS**\\
const inputNewTodo = document.querySelector('.todo-input');
const buttonAddTodo = document.querySelector('.todo-button');
const buttonReset = document.getElementById('reset-button');
const dropDownFilter = document.querySelector('.filter-todo');
const listTodos = document.querySelector('.todo-list');
const textUser = document.getElementById('main-text');

//**EVENTS**\\
document.addEventListener('DOMContentLoaded', loadTodoList);
buttonAddTodo.addEventListener('click', addTodo);
buttonReset.addEventListener('click', resetX);
listTodos.addEventListener('click', controlTodo);
dropDownFilter.addEventListener('click', filterTodo);

//**LOCAL VARIABLES**\\
let todos = []; //local list
let url = 'http://localhost:3000/'; //url

//**EVENT FUNCTIONS**\\

//delete all data
async function resetX() {
	localStorage.removeItem('user'); //removes user from local storage

	//send a delete request to the server
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

//create a todo
async function addTodo(e) {
	//Prevent natural behaviour
	e.preventDefault();
	//reload the page -- without reloading have some bugs
	location.reload();

	//Create todo div
	const todoDiv = document.createElement('div');
	todoDiv.classList.add('todo');

	//Create list
	const newTodo = document.createElement('li');
	newTodo.innerText = inputNewTodo.value;

	//request to server
	await newTodoRequest(todoDiv,newTodo);

	newTodo.classList.add('todo-item');
	todoDiv.appendChild(newTodo);
	inputNewTodo.value = '';

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
	listTodos.appendChild(todoDiv);
}

function controlTodo(e) {
	const item = e.target;
	const targetUrl = url + item.parentElement.id;

	//click event on delete button
	if (item.classList[0] === 'trash-btn') {

		const todo = item.parentElement;
		todo.classList.add('fall');

		//remove todo ;
		deleteTodoRequest(targetUrl);

		todo.addEventListener('transitionend', (e) => {
			todo.remove(e);
		});
	}

	//--click event on complete button
	if (item.classList[0] === 'complete-btn') {
		const todo = item.parentElement;

		//toggle for completed
		if (todo.classList[2] == null) {
			switchComplete(targetUrl, true)
			todo.classList.add('completed');
		} else if (todo.classList[2] != null) {
			switchComplete(targetUrl, false)
			todo.classList.remove('completed');
		}
	}

	//--click to change importance
	if (item.classList.contains('todo') || item.classList.contains('todo-item')) {
		let target = item.parentElement;
		//if normal change to important 
		if (target.classList.contains('normal')) {
			target.className = target.className.replace(
				/(?:^|\s)normal(?!\S)/g,
				' important'
			);
			switchImportance(targetUrl, 'important')
			//test target
			console.log(target);
		//if important change to not important 
		} else if (target.classList.contains('important')) {
			target.className = target.className.replace(
				/(?:^|\s)important(?!\S)/g,
				' not-important'
			);
			switchImportance(targetUrl, 'not-important')
			//test target
			console.log(target);
		//if its not important change it to normal
		} else if (target.classList.contains('not-important')) {
			target.className = target.className.replace(
				/(?:^|\s)not-important(?!\S)/g,
				' normal'
			);
			switchImportance(targetUrl, 'normal')
			//test target
			console.log(target);
		}
	}
}

function filterTodo(e) {
	const todos = listTodos.childNodes;
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

async function loadTodoList(e) {
	e.preventDefault();

	//get and set the name, store it locally
	if (!localStorage.getItem('user')) {
		textUser.innerHTML = window.prompt('Whats your name?', 'Jason');
		localStorage.setItem('user', textUser.innerHTML);
		console.log(localStorage.getItem('user'));
	} else {
		textUser.innerHTML = localStorage.getItem('user');
	}
	//get all the data on load.
	await fetch('http://localhost:3000/', {
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
				inputNewTodo.value = '';
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
				listTodos.appendChild(todoDiv);
			});
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	console.log(todos);
}

//**OTHER FUNCTIONS**\\
//requests
async function newTodoRequest(todoDiv, newTodo) {
	//prepare the request body
	let data = { title: `${newTodo.innerText}` };
	//send a post request for create a new todo
	await fetch(url, {
		method: 'POST',
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
}
async function deleteTodoRequest(targetUrl) {
	fetch(targetUrl, {
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
function switchComplete(targetUrl, bool) {
	let bodyString = { done: `${bool}` };
	fetch(targetUrl, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(bodyString),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log('Success:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}
function switchImportance(targetUrl, importance){
	fetch(targetUrl, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ difficulty: `${importance}` }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log('Success:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}
//format the input date
function formatDate(d) {
	let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
	let da = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(d);
	let ho = new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(d);
	let mi = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
	let newDate = `${da}, ${ho}`;
	return newDate;
}
