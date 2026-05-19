const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const error = document.getElementById("error");
const clearCompleted = document.getElementById("clearCompleted");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

renderTodos();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = taskInput.value.trim();

  // VALIDASI
  if (text === "") {
    error.textContent = "Tugas tidak boleh kosong!";
    return;
  }

  if (text.length < 3) {
    error.textContent = "Minimal 3 karakter!";
    return;
  }

  if (text.length > 100) {
    error.textContent = "Maksimal 100 karakter!";
    return;
  }

  error.textContent = "";

  const todo = {
    id: Date.now(),
    text,
    completed: false,
    priority: priorityInput.value,
  };

  todos.push(todo);

  saveTodos();
  renderTodos();

  taskInput.value = "";
});

function renderTodos() {
  taskList.innerHTML = "";

  let filteredTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.draggable = true;

    if (todo.completed) {
      li.classList.add("completed");
    }
    // DRAG START
    li.addEventListener("dragstart", () => {
      li.classList.add("dragging");
    });
    // DRAG END
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      updateDraggedOrder();
    });
    li.innerHTML = `
      <div class="task-info">
        <input type="checkbox" ${todo.completed ? "checked" : ""}>

        <span class="task-text">${todo.text}</span>

        <span class="priority ${todo.priority}">
          ${todo.priority}
        </span>
      </div>

      <button class="delete-btn">Hapus</button>
    `;

    const checkbox = li.querySelector("input");
    const deleteBtn = li.querySelector(".delete-btn");
    const taskText = li.querySelector(".task-text");

    // CHECKBOX
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    // HAPUS
    deleteBtn.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    // EDIT
    taskText.addEventListener("dblclick", () => {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = todo.text;

      taskText.replaceWith(inputEdit);

      inputEdit.focus();

      function saveEdit() {
        if (inputEdit.value.trim() !== "") {
          todo.text = inputEdit.value.trim();
          saveTodos();
          renderTodos();
        }
      }

      inputEdit.addEventListener("blur", saveEdit);

      inputEdit.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          saveEdit();
        }
      });
    });

    taskList.appendChild(li);
  });

  updateCounter();
}

function updateCounter() {
  const activeTasks = todos.filter((todo) => !todo.completed).length;
  counter.textContent = `${activeTasks} tugas tersisa`;
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// FILTER
document.querySelectorAll(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});
clearCompleted.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});
// DRAG & DROP
taskList.addEventListener("dragover", (e) => {
  e.preventDefault();

  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(taskList, e.clientY);

  if (afterElement == null) {
    taskList.appendChild(dragging);
  } else {
    taskList.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll("li:not(.dragging)")];

  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();

      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}

function updateDraggedOrder() {
  const items = [...taskList.children];

  const newTodos = [];

  items.forEach((item) => {
    const text = item.querySelector(".task-text").textContent;

    const found = todos.find((todo) => todo.text === text);

    if (found) {
      newTodos.push(found);
    }
  });
  todos = newTodos;
  saveTodos();
}
