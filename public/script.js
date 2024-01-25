document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="${task.completed ? 'completed' : ''}">${task.text} - Due: ${task.dueDate} - Category: ${task.category}</span>
                    <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
                    <input type="checkbox" onchange="toggleComplete('${task._id}')" ${task.completed ? 'checked' : ''}>
                `;
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error(error));
}
function addTask() {
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date');
    const categoryInput = document.getElementById('category');
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const category = categoryInput.value;
    if (text === '') return;
    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text,
            dueDate,
            category,
            completed: false,
        }),
    })
        .then(response => response.json())
        .then(() => {
            loadTasks();
            taskInput.value = '';
            dueDateInput.value = '';
        })
        .catch(error => console.error(error));
}
function deleteTask(id) {
    fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
    })
        .then(() => loadTasks())
        .catch(error => console.error(error));
}
function toggleComplete(id) {
    fetch(`/api/tasks/${id}/toggle`, {
        method: 'PUT',
    })
        .then(() => loadTasks())
        .catch(error => console.error(error));
}
