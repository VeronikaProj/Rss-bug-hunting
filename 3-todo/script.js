const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const errorEl = document.getElementById("error");
const clearBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");
const FILTERS = {
  ALL: "all",
  DONE: "done",
  ACTIVE: "active"
}

let tasks = [];
let currentFilter = FILTERS.ALL;
let nextId = 1;

function addTask() {
  const text = input.value;
  if (text.trim() == "") { 
    errorEl.hidden = false;
  }
  else
  {
    tasks.push({ id: nextId++, text: text, done: false });
    input.value = "";
    render();
  };
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task.done) { task.done = false;}
  else { task.done = true; };
  render();
}

function deleteTask(id) {
  indexToDelete = tasks.findIndex((t) => t.id == id);
  tasks.splice(indexToDelete,1);
  render();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.done);
  render();
}

function getVisibleTasks() {
  let visibleTasks;

  switch (currentFilter) {
    case FILTERS.ACTIVE : 
      visibleTasks = tasks.filter(task => !task.done);
      break;
    case FILTERS.DONE :
      visibleTasks = tasks.filter(task => task.done);
      break;
    default:
      visibleTasks = tasks;
  }
  return visibleTasks;
}

function updateCounter() {
  counter.textContent = "Активных задач: " + tasks.filter(task => !task.done).length;
}

function hideErrorMessage() {
  errorEl.hidden = true;
}

function render() {
  const visible = getVisibleTasks();
  list.replaceChildren();

  for (let i = 0; i < visible.length; i++) {
    const task = visible[i];
    const li = document.createElement("li");
    li.className = "task";
    li.id = i;
    if (task.done) {
      li.classList.add("done");
    }

    const span = document.createElement("span");
    span.className = "task__text";
    span.textContent = task.text;
    span.addEventListener("click", () => toggleTask(task.id));

    const del = document.createElement("button");
    del.className = "task__del";
    del.textContent = "✕";
    del.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  }
  updateCounter();
}

addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearCompleted);
input.addEventListener("click", hideErrorMessage);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});


render();
