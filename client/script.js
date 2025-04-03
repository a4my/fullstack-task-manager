const API_URL = 'http://localhost:3000/api/tasks';

async function fetchTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  const tasksDiv = document.getElementById('tasks');
  tasksDiv.innerHTML = '';
  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'bg-white p-4 rounded mb-2 shadow';
    taskElement.innerHTML = `
      <h2 class="font-bold text-indigo-600">${task.title}</h2>
      <p>${task.description}</p>
      <button class="text-red-500" onclick="deleteTask(${task.id})">Delete</button>
    `;
    tasksDiv.appendChild(taskElement);
  });
}

async function addTask(e) {
  e.preventDefault();
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    alert('Title is required');
    return;
  }

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });

  titleInput.value = '';
  descriptionInput.value = '';
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  fetchTasks();
}

document.getElementById('taskForm').addEventListener('submit', addTask);

// Initial fetch of tasks
fetchTasks();
