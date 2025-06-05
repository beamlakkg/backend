const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const tasksRoutes = require('./routes/tasks');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create tasks.json file if it doesn't exist
const tasksFilePath = path.join(dataDir, 'tasks.json');
if (!fs.existsSync(tasksFilePath)) {
  fs.writeFileSync(tasksFilePath, JSON.stringify([]));
}

// Middleware
app.use(morgan('dev')); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// API Routes
app.use('/api/tasks', tasksRoutes);

// Simple "API is running" page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});