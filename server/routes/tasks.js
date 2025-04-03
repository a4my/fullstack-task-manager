// server/routes/tasks.js
const express = require('express');
const router = express.Router();

// In-memory tasks store
let tasks = [];
let idCounter = 1;

// GET all tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// POST create a new task
router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = {
    id: idCounter++,
    title,
    description: description || '',
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update a task
router.put('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  task.title = title !== undefined ? title : task.title;
  task.description = description !== undefined ? description : task.description;
  task.completed = completed !== undefined ? completed : task.completed;
  res.json(task);
});

// DELETE a task
router.delete('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const deletedTask = tasks.splice(index, 1);
  res.json(deletedTask[0]);
});

module.exports = router;
