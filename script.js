function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");

  li.innerHTML = `
    <input type="checkbox" onchange="toggleComplete(this)">
    <span class="task-text" onclick="editTask(this)">${taskText}</span>
    <div class="actions">
      <button class="edit-btn" onclick="editTask(this)">Edit</button>
      <button onclick="deleteTask(this)">Delete</button>
    </div>
  `;

  document.getElementById("taskList").appendChild(li);
  input.value = "";
}

function toggleComplete(checkbox) {
  const li = checkbox.closest("li");
  li.classList.toggle("completed");
}

function deleteTask(button) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (confirmDelete) {
    button.closest("li").remove();
  }
}

function editTask(target) {
  // Get the parent <li> and the span with the task text
  const li = target.closest("li");
  const span = li.querySelector(".task-text");

  // Check if it's already an input (to avoid multiple inputs)
  if (li.querySelector("input.editing")) return;

  const currentText = span.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "task-text editing";
  input.style.flex = "1";

  span.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => finishEdit(input));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishEdit(input);
  });
}

function finishEdit(input) {
  const newText = input.value.trim();
  if (newText === "") {
    alert("Task cannot be empty!");
    input.focus();
    return;
  }

  const newSpan = document.createElement("span");
  newSpan.textContent = newText;
  newSpan.className = "task-text";
  newSpan.setAttribute("onclick", "editTask(this)");

  input.replaceWith(newSpan);
}
