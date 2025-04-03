const API_URL = 'http://localhost:3000/api/tasks';
let tasksList = [];
let editingTaskId = null;

async function fetchTasks() {
  const response = await fetch(API_URL);
  tasksList = await response.json();
  renderTasks(tasksList);
}

function renderTasks(tasks) {
  const tasksDiv = document.getElementById('tasks');
  tasksDiv.innerHTML = '';
  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'bg-white p-4 rounded mb-2 shadow';
    taskElement.innerHTML = `
      <h2 class="font-bold text-indigo-600 first-letter-capitalize">${task.title}</h2>
      <p class="first-letter-capitalize">${task.description}</p>
      <div class="flex space-x-2 mt-2">
        <button class="text-indigo-500" onclick="editTask(${task.id})">Edit</button>
        <button class="text-red-500" onclick="deleteTask(${task.id})">Delete</button>
      </div>
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

  if (editingTaskId) {
    // Update the task with a PUT request
    await fetch(`${API_URL}/${editingTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    editingTaskId = null; // Clear editing mode after update
  } else {
    // Create a new task with a POST request
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
  }

  // Clear the form fields and refresh the task list
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

function editTask(id) {
  // Find the task in the global tasksList
  const task = tasksList.find(t => t.id === id);
  if (!task) return;
  // Populate the form with the task data
  document.getElementById('title').value = task.title;
  document.getElementById('description').value = task.description;
  // Set the editing mode to the task's id
  editingTaskId = id;
}

// Attach the form submit event
document.getElementById('taskForm').addEventListener('submit', addTask);

// Initial tasks fetch
fetchTasks();
