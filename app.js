const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const listDiv = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  listDiv.innerHTML = '';
  tasks.forEach((task, idx) => {
    const item = document.createElement('div');
    item.className = 'todo-item' + (task.completed ? ' completed' : '');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'task-checkbox';
    checkbox.addEventListener('change', () => {
      tasks[idx].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = task.text;
    text.addEventListener('click', () => {
      tasks[idx].completed = !tasks[idx].completed;
      saveTasks();
      renderTasks();
    });

    const leftContainer = document.createElement('div');
    leftContainer.className = 'left-container';
    leftContainer.appendChild(checkbox);
    leftContainer.appendChild(text);

    const del = document.createElement('button');
    del.textContent = '✕';
    del.className = 'delete-btn';
    del.addEventListener('click', () => {
      tasks.splice(idx, 1);
      saveTasks();
      renderTasks();
    });

    const edit = document.createElement('button');
    edit.textContent = '✎';
    edit.className = 'edit-btn';
    edit.addEventListener('click', () => {
      const newText = prompt('Edit task:', task.text);
      if (newText !== null) {
        const trimmedText = newText.trim();
        if (trimmedText.length > 0) {
          tasks[idx].text = trimmedText;
          saveTasks();
          renderTasks();
        }
      }
    });

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';
    buttonsContainer.appendChild(edit);
    buttonsContainer.appendChild(del);

    item.appendChild(leftContainer);
    item.appendChild(buttonsContainer);
    listDiv.appendChild(item);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  input.value = '';
});

const darkModeToggle = document.getElementById('dark-mode-toggle');
const todoContainer = document.querySelector('.todo-container');

function applyDarkMode(isDark) {
  if (isDark) {
    todoContainer.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
  } else {
    todoContainer.classList.remove('dark-mode');
    darkModeToggle.textContent = '🌙';
  }
}

darkModeToggle.addEventListener('click', () => {
  const isDark = todoContainer.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark);
  applyDarkMode(isDark);
});

// Apply saved preference on load
const savedDarkMode = localStorage.getItem('darkMode') === 'true';
applyDarkMode(savedDarkMode);

renderTasks();

const clearAllBtn = document.getElementById('clear-all-btn');
clearAllBtn.addEventListener('click', () => {
  tasks = [];
  saveTasks();
  renderTasks();
});
