const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const counters = {
  total: document.getElementById('counter-total'),
  active: document.getElementById('counter-active'),
  completed: document.getElementById('counter-completed')
};
const filters = {
  all: document.getElementById('filter-all'),
  active: document.getElementById('filter-active'),
  completed: document.getElementById('filter-completed')
};

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function updateCounters() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  counters.total.textContent = `${total} total`;
  counters.completed.textContent = `${completed} completed`;
  counters.active.textContent = `${total - completed} active`;
}
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, i) => {
    if (currentFilter === 'active' && task.completed) return;
    if (currentFilter === 'completed' && !task.completed) return;

    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="small-btn edit" data-index="${i}">✎</button>
        <button class="small-btn toggle" data-index="${i}">✔</button>
        <button class="small-btn delete" data-index="${i}">✖</button>
      </div>`;
    taskList.appendChild(li);
  });
  updateCounters();
  saveTasks();
}
input.addEventListener('keyup', e => {
  if (e.key === 'Enter') addTask();
});
addBtn.addEventListener('click', addTask);

Object.keys(filters).forEach(key => {
  filters[key].addEventListener('click', () => {
    currentFilter = key;
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    filters[key].classList.add('active');
    renderTasks();
  });
});

taskList.addEventListener('click', e => {
  const index = e.target.dataset.index;
  if (!index) return;

  if (e.target.classList.contains('delete')) tasks.splice(index, 1);
  else if (e.target.classList.contains('toggle')) tasks[index].completed = !tasks[index].completed;
  else if (e.target.classList.contains('edit')) {
    const newText = prompt('Edit Task:', tasks[index].text);
    if (newText !== null) tasks[index].text = newText.trim() || tasks[index].text;
  }
  renderTasks();
});

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  input.value = '';
  renderTasks();
}

renderTasks();
