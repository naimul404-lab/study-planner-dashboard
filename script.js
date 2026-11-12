let timerDuration = 25 * 60;
let timerInterval = null;
let isRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const startTimerBtn = document.getElementById('startTimer');
const pauseTimerBtn = document.getElementById('pauseTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const minutesInput = document.getElementById('minutesInput');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timerDuration);
}

function updateTimerFromInput() {
  const value = Number(minutesInput.value) || 25;
  timerDuration = value * 60;
  renderTimer();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timerInterval = setInterval(() => {
    if (timerDuration > 0) {
      timerDuration -= 1;
      renderTimer();
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      alert('Focus session complete! Take a short break.');
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timerDuration = (Number(minutesInput.value) || 25) * 60;
  renderTimer();
}

startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);
minutesInput.addEventListener('change', updateTimerFromInput);
renderTimer();

const savedTasks = JSON.parse(localStorage.getItem('studyTasks') || '[]');

function saveTasks() {
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
}

let tasks = savedTasks;

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const label = document.createElement('span');
    label.textContent = task.text;
    if (task.done) label.classList.add('task-done');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'task-delete';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();

  if (!value) return;

  tasks.push({ text: value, done: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
});

renderTasks();
