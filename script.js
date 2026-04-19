/**
 * DOCKET — To-Do App
 * Vanilla JS · localStorage · Drag-and-drop · Dark mode
 */

'use strict';

/* ════════════════════════════════════════════════
   STATE
   ════════════════════════════════════════════════ */

/** @type {{ id: string, text: string, completed: boolean, createdAt: string, dueDate: string|null }[]} */
let tasks = [];
let currentFilter = 'all'; // 'all' | 'pending' | 'completed'
let dragSrcId = null;       // ID of item being dragged

/* ════════════════════════════════════════════════
   DOM REFERENCES
   ════════════════════════════════════════════════ */
const taskList          = document.getElementById('taskList');
const taskInput         = document.getElementById('taskInput');
const dueDateInput      = document.getElementById('dueDateInput');
const addBtn            = document.getElementById('addBtn');
const emptyState        = document.getElementById('emptyState');
const taskSummary       = document.getElementById('taskSummary');
const dateDisplay       = document.getElementById('dateDisplay');
const themeToggle       = document.getElementById('themeToggle');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns        = document.querySelectorAll('.filter-btn');
const toast             = document.getElementById('toast');
const toastMessage      = document.getElementById('toastMessage');
const toastAction       = document.getElementById('toastAction');

let lastRemovedTask = null;
let lastRemovedIndex = null;
let toastTimer = null;


/* ════════════════════════════════════════════════
   STORAGE HELPERS
   ════════════════════════════════════════════════ */

/** Persist tasks array to localStorage */
function saveTasks() {
  localStorage.setItem('docket_tasks', JSON.stringify(tasks));
}

/** Load tasks from localStorage; returns array */
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('docket_tasks')) || [];
  } catch {
    return [];
  }
}

/** Load dark-mode preference */
function loadTheme() {
  const saved = localStorage.getItem('docket_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.querySelector('.theme-icon').textContent = '☀';
  }
}

/* ════════════════════════════════════════════════
   ID GENERATION
   ════════════════════════════════════════════════ */

/** Returns a unique ID string (timestamp + random) */
function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ════════════════════════════════════════════════
   DATE HELPERS
   ════════════════════════════════════════════════ */

/** Format ISO date string as e.g. "Mon, 17 Apr 2026" */
function formatDate(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/** Returns 'overdue', 'today', or 'future' relative to today */
function dueDateStatus(isoDate) {
  if (!isoDate) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const due   = new Date(isoDate + 'T00:00:00');
  if (due < today)  return 'overdue';
  if (due.getTime() === today.getTime()) return 'today';
  return 'future';
}

/** Set the header date string */
function renderHeaderDate() {
  dateDisplay.textContent = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).toUpperCase();
}

/* ════════════════════════════════════════════════
   SUMMARY
   ════════════════════════════════════════════════ */

function renderSummary() {
  const pending = tasks.filter(t => !t.completed).length;
  taskSummary.textContent = pending === 0
    ? 'All done ✦'
    : `${pending} task${pending !== 1 ? 's' : ''} remaining`;
}

function truncateText(text, length) {
  return text.length > length ? text.slice(0, length - 1) + '…' : text;
}

function showToast(message, actionLabel, actionCallback) {
  if (!toast || !toastMessage) return;
  toastMessage.textContent = message;

  if (actionLabel && actionCallback) {
    toastAction.textContent = actionLabel;
    toastAction.onclick = actionCallback;
    toastAction.hidden = false;
  } else {
    toastAction.hidden = true;
    toastAction.onclick = null;
  }

  toast.hidden = false;
  toast.classList.add('show');
  toast.setAttribute('aria-hidden', 'false');

  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = window.setTimeout(hideToast, 4200);
}

function hideToast() {
  if (!toast) return;
  toast.classList.remove('show');
  toast.setAttribute('aria-hidden', 'true');
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  window.setTimeout(() => {
    if (toast) toast.hidden = true;
  }, 240);
}

function undoDelete() {
  if (!lastRemovedTask || lastRemovedIndex === null) return;
  tasks.splice(lastRemovedIndex, 0, lastRemovedTask);
  saveTasks();
  render();
  lastRemovedTask = null;
  lastRemovedIndex = null;
  hideToast();
}

/* ════════════════════════════════════════════════
   RENDER
   ════════════════════════════════════════════════ */

function getFilteredTasks() {
  if (currentFilter === 'pending')   return tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') return tasks.filter(t =>  t.completed);
  return tasks;
}

/** Main render: clear list and re-draw all visible tasks */
function render() {
  const visible = getFilteredTasks();

  // Show/hide empty state
  emptyState.hidden = visible.length > 0;

  // Clear existing items
  taskList.innerHTML = '';

  // Build each task element
  visible.forEach(task => {
    const li = buildTaskElement(task);
    taskList.appendChild(li);
  });

  renderSummary();
}

/** Create a <li> DOM element for a task */
function buildTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item${task.completed ? ' completed' : ''}`;
  li.dataset.id = task.id;
  li.draggable = true;

  // ── Checkbox ──
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', 'Toggle task complete');
  checkbox.addEventListener('change', () => toggleTask(task.id));

  // ── Body ──
  const body = document.createElement('div');
  body.className = 'task-body';

  const textEl = document.createElement('span');
  textEl.className = 'task-text';
  textEl.textContent = task.text;
  // Double-click to edit
  textEl.addEventListener('dblclick', () => startEdit(task.id, li, textEl));

  body.appendChild(textEl);

  // Due date badge
  if (task.dueDate) {
    const status = dueDateStatus(task.dueDate);
    const dueEl = document.createElement('span');
    dueEl.className = `task-due${status === 'overdue' ? ' overdue' : status === 'today' ? ' today' : ''}`;
    dueEl.textContent = (status === 'overdue' ? '⚠ Overdue · ' : status === 'today' ? '◎ Today · ' : '◷ Due ') + formatDate(task.dueDate);
    body.appendChild(dueEl);
  }

  // ── Timestamp ──
  const tsEl = document.createElement('span');
  tsEl.className = 'task-due';
  tsEl.style.opacity = '.55';
  tsEl.textContent = '✦ Added ' + new Date(task.createdAt).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })
    + ' · ' + new Date(task.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
  body.appendChild(tsEl);

  // ── Actions ──
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'action-btn edit-btn';
  editBtn.setAttribute('aria-label', 'Edit task');
  editBtn.title = 'Edit';
  editBtn.textContent = '✎';
  editBtn.addEventListener('click', () => startEdit(task.id, li, textEl));

  const delBtn = document.createElement('button');
  delBtn.className = 'action-btn delete-btn';
  delBtn.setAttribute('aria-label', 'Delete task');
  delBtn.title = 'Delete';
  delBtn.textContent = '✕';
  delBtn.addEventListener('click', () => deleteTask(task.id, li));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  // Assemble
  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(actions);

  // Drag events
  li.addEventListener('dragstart', onDragStart);
  li.addEventListener('dragover',  onDragOver);
  li.addEventListener('drop',      onDrop);
  li.addEventListener('dragend',   onDragEnd);
  li.addEventListener('dragleave', onDragLeave);

  return li;
}

/* ════════════════════════════════════════════════
   TASK OPERATIONS
   ════════════════════════════════════════════════ */

/** Add a new task */
function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    // Shake the input
    taskInput.classList.add('shake');
    taskInput.addEventListener('animationend', () => taskInput.classList.remove('shake'), { once: true });
    taskInput.focus();
    return;
  }

  const task = {
    id:        generateId(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate:   dueDateInput.value || null,
  };

  tasks.unshift(task); // newest first
  saveTasks();
  render();

  // Reset inputs
  taskInput.value = '';
  dueDateInput.value = '';
  taskInput.focus();
}

/** Toggle a task's completed state */
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  render();
}

/** Delete a task with an exit animation */
function deleteTask(id, liEl) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return;
  lastRemovedTask = tasks[index];
  lastRemovedIndex = index;

  tasks.splice(index, 1);
  saveTasks();
  liEl.classList.add('removing');
  showToast(`Removed “${truncateText(lastRemovedTask.text, 32)}”`, 'Undo', undoDelete);
  window.setTimeout(() => {
    render();
  }, 220);
}

/** Begin inline editing of a task */
function startEdit(id, liEl, textEl) {
  if (liEl.querySelector('.task-edit-input')) return; // already editing

  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-edit-input';
  input.value = task.text;
  input.maxLength = 200;
  input.setAttribute('aria-label', 'Edit task text');

  // Replace text span with input
  textEl.replaceWith(input);
  input.focus();
  input.select();

  const commit = () => {
    const newText = input.value.trim();
    if (newText && newText !== task.text) {
      task.text = newText;
      saveTasks();
    }
    render(); // re-draw
  };

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') { input.value = task.text; input.blur(); }
  });
}

/** Delete all completed tasks */
function clearCompleted() {
  const completedEls = taskList.querySelectorAll('.task-item.completed');
  if (completedEls.length === 0) return;

  // Animate out all completed items, then purge
  let pending = completedEls.length;
  completedEls.forEach(el => {
    el.classList.add('removing');
    el.addEventListener('animationend', () => {
      pending--;
      if (pending === 0) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        render();
      }
    }, { once: true });
  });
}

/* ════════════════════════════════════════════════
   FILTER
   ════════════════════════════════════════════════ */

function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  render();
}

/* ════════════════════════════════════════════════
   DRAG AND DROP (reorder)
   ════════════════════════════════════════════════ */

function onDragStart(e) {
  dragSrcId = this.dataset.id;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragSrcId);
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  // Remove drag-over from all, add to this
  document.querySelectorAll('.task-item').forEach(el => el.classList.remove('drag-over'));
  if (this.dataset.id !== dragSrcId) {
    this.classList.add('drag-over');
  }
}

function onDragLeave() {
  this.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const targetId = this.dataset.id;
  if (!dragSrcId || dragSrcId === targetId) return;

  // Reorder in tasks array
  const srcIdx = tasks.findIndex(t => t.id === dragSrcId);
  const tgtIdx = tasks.findIndex(t => t.id === targetId);
  if (srcIdx === -1 || tgtIdx === -1) return;

  // Splice src out, insert before/after target
  const [moved] = tasks.splice(srcIdx, 1);
  tasks.splice(tgtIdx, 0, moved);

  saveTasks();
  render();
}

function onDragEnd() {
  document.querySelectorAll('.task-item').forEach(el => {
    el.classList.remove('dragging', 'drag-over');
  });
  dragSrcId = null;
}

/* ════════════════════════════════════════════════
   DARK MODE
   ════════════════════════════════════════════════ */

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.querySelector('.theme-icon').textContent = '☽';
    localStorage.setItem('docket_theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.querySelector('.theme-icon').textContent = '☀';
    localStorage.setItem('docket_theme', 'dark');
  }
}

/* ════════════════════════════════════════════════
   EVENT LISTENERS
   ════════════════════════════════════════════════ */

// Add task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// Clear completed
clearCompletedBtn.addEventListener('click', clearCompleted);

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

/* ════════════════════════════════════════════════
   KEYBOARD SHORTCUT (/ to focus input)
   ════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== taskInput) {
    e.preventDefault();
    taskInput.focus();
  }
});

/* ════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════ */

(function init() {
  loadTheme();
  renderHeaderDate();
  tasks = loadTasks();
  render();
})();
