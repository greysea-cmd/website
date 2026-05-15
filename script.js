// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks() {
    let filteredTasks = tasks;
    
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="empty-message">No tasks to display</li>';
        taskCount.textContent = `${tasks.length} total tasks`;
        return;
    }
    
    taskList.innerHTML = filteredTasks.map(task => `
        <li class="${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn">Delete</button>
        </li>
    `).join('');
    
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.length - completedCount;
    taskCount.textContent = `${pendingCount} pending, ${completedCount} completed (${tasks.length} total)`;
    
    // Add event listeners to checkboxes and delete buttons
    document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            const taskId = parseInt(checkbox.closest('li').dataset.id);
            toggleTask(taskId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const taskId = parseInt(btn.closest('li').dataset.id);
            deleteTask(taskId);
        });
    });
}

// Helper to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Please enter a task!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Toggle task completion
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Change filter
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderTasks();
}

// Event listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
clearCompletedBtn.addEventListener('click', clearCompleted);
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// Initial render
renderTasks();