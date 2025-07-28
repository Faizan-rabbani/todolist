window.onload = function () {
  loadTasks();
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
};

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.querySelector(".task-text")?.textContent || '',
      completed: li.classList.contains("completed"),
      due: li.getAttribute("data-due"),
      priority: li.getAttribute("data-priority")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateCounter();
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  saved.forEach(task => {
    createTask(task.text, task.due, task.priority, task.completed);
  });
  updateCounter();
}

function addTask() {
  const taskText = document.getElementById("taskInput").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if (!taskText) {
    alert("Please enter a task!");
    return;
  }

  createTask(taskText, dueDate, priority, false);
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("priority").value = "";
  saveTasks();
}

function createTask(text, due, priority, completed) {
  const li = document.createElement("li");
  if (priority) li.classList.add(priority);
  li.setAttribute("data-priority", priority);
  li.setAttribute("data-due", due);

  li.innerHTML = `
    <div class="task-top">
      <input type="checkbox" onchange="toggleComplete(this)" ${completed ? "checked" : ""}>
      <span class="task-text" onclick="editTask(this)">${text}</span>
    </div>
    ${due ? `<small class="priority-label">📅 Due: ${due}</small>` : ""}
    ${priority ? `<small class="priority-label">🏷️ Priority: ${priority}</small>` : ""}
    <div class="actions">
      <button class="edit-btn" onclick="editTask(this)">Edit</button>
      <button onclick="deleteTask(this)">Delete</button>
    </div>
  `;

  if (completed) li.classList.add("completed");

  document.getElementById("taskList").appendChild(li);
}

function toggleComplete(checkbox) {
  const li = checkbox.closest("li");
  li.classList.toggle("completed");
  saveTasks();
}

function deleteTask(button) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (confirmDelete) {
    button.closest("li").remove();
    saveTasks();
  }
}

function editTask(target) {
  const li = target.closest("li");
  const span = li.querySelector(".task-text");
  if (li.querySelector("input.editing")) return;

  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "task-text editing";

  span.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => finishEdit(input));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishEdit(input);
  });
}

function finishEdit(input) {
  const newText = input.value.trim();
  if (!newText) {
    alert("Task cannot be empty!");
    input.focus();
    return;
  }

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = newText;
  span.setAttribute("onclick", "editTask(this)");
  input.replaceWith(span);
  saveTasks();
}

function filterTasks() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  document.querySelectorAll("#taskList li").forEach((li) => {
    const text = li.textContent.toLowerCase();
    li.style.display = text.includes(query) ? "flex" : "none";
  });
}

function updateCounter() {
  const total = document.querySelectorAll("#taskList li").length;
  const completed = document.querySelectorAll("#taskList li.completed").length;
  document.getElementById("taskCounter").innerText = `✅ ${completed} / 🗂 ${total} tasks completed`;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}
