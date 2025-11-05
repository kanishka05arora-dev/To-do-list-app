// DOM Elements
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompleted");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");

// State
let todos = [];
let currentFilter = "all";

// Initialize app
function init() {
  loadTodos();
  renderTodos();
  setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTodos();
    });
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);
}

// Add Todo
function addTodo() {
  const text = todoInput.value.trim();

  if (text === "") {
    todoInput.focus();
    return;
  }

  const todo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(todo);
  todoInput.value = "";
  todoInput.focus();

  saveTodos();
  renderTodos();
}

// Toggle Todo Complete
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

// Delete Todo
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

// Clear Completed Todos
function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  renderTodos();
}

// Filter Todos
function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
}

// Render Todos
function renderTodos() {
  const filteredTodos = getFilteredTodos();

  todoList.innerHTML = "";

  if (filteredTodos.length === 0) {
    emptyState.classList.add("show");
    if (currentFilter === "all" && todos.length === 0) {
      emptyState.innerHTML =
        "<p>✨ No tasks yet. Add one above to get started!</p>";
    } else if (currentFilter === "active") {
      emptyState.innerHTML = "<p>🎉 No active tasks! Great job!</p>";
    } else if (currentFilter === "completed") {
      emptyState.innerHTML = "<p>📋 No completed tasks yet.</p>";
    }
  } else {
    emptyState.classList.remove("show");
    filteredTodos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;
      li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? "checked" : ""}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${
                  todo.id
                })">Delete</button>
            `;
      todoList.appendChild(li);
    });
  }

  updateTaskCount();
}

// Update Task Count
function updateTaskCount() {
  const activeCount = todos.filter((t) => !t.completed).length;
  const totalCount = todos.length;

  if (totalCount === 0) {
    taskCount.textContent = "0 tasks";
  } else if (activeCount === 1) {
    taskCount.textContent = "1 task remaining";
  } else {
    taskCount.textContent = `${activeCount} tasks remaining`;
  }

  // Show/hide clear completed button
  const hasCompleted = todos.some((t) => t.completed);
  clearCompletedBtn.style.display = hasCompleted ? "block" : "none";
}

// Save Todos to Local Storage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Load Todos from Local Storage
function loadTodos() {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initialize the app when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
