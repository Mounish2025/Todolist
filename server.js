const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/todoapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
const taskSchema = new mongoose.Schema({
    text: String,
    dueDate: String,
    category: String,
    completed: Boolean,
});
const Task = mongoose.model('Task', taskSchema);
app.use(express.json());
app.use(express.static('public'));
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/api/tasks', async (req, res) => {
    try {
        const { text, dueDate, category, completed } = req.body;
        const newTask = new Task({ text, dueDate, category, completed });
        await newTask.save();
        res.json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        await Task.findByIdAndDelete(taskId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/api/tasks/:id/toggle', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        task.completed = !task.completed;
        await task.save();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

