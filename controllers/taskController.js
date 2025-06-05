const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '../data/tasks.json');

// Helper function to read tasks from file
const readTasks = () => {
  try {
    const tasksData = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(tasksData);
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return [];
  }
};

// Helper function to write tasks to file
const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing tasks file:', error);
    return false;
  }
};

// GET /api/tasks - Get all tasks
exports.getAllTasks = (req, res) => {
  const tasks = readTasks();
  res.status(200).json(tasks);
};

// POST /api/tasks - Create a new task
exports.createTask = (req, res) => {
  const { title, description } = req.body;
  
  // Validate input
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const tasks = readTasks();
  
  // Create new task
  const newTask = {
    id: Date.now().toString(), // Simple unique ID generation
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  if (writeTasks(tasks)) {
    res.status(201).json(newTask);
  } else {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// PUT /api/tasks/:id - Update a task (mark as completed)
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  
  // Validate input
  if (completed === undefined) {
    return res.status(400).json({ error: 'Completed status is required' });
  }
  
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  // Update task
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    completed,
    updatedAt: new Date().toISOString()
  };
  
  if (writeTasks(tasks)) {
    res.status(200).json(tasks[taskIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// DELETE /api/tasks/:id - Delete a task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  // Remove task
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  if (writeTasks(tasks)) {
    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
  } else {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};