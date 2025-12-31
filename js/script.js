const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressFill = document.querySelector(".progress-fill");
const prioritySelect = document.getElementById("prioritySelect");
const dateInput = document.getElementById("dateInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ===== Utilities ===== */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function generateId() {
    return Date.now().toString();
}

function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

/* ===== Progress ===== */
function updateProgress() {
    if (tasks.length === 0) {
        progressFill.style.width = "0%";
        return;
    }
    const completed = tasks.filter(t => t.completed).length;
    progressFill.style.width = `${(completed / tasks.length) * 100}%`;
}

/* ===== Render ===== */
function renderTasks() {
    taskList.innerHTML = "";

    const grouped = {};

    tasks.forEach(task => {
        grouped[task.dueDate] ??= [];
        grouped[task.dueDate].push(task);
    });

    Object.keys(grouped).sort().forEach(date => {
        const section = document.createElement("div");
        section.className = "date-section";
        section.innerHTML = `<h3 class="date-heading">${formatDate(date)}</h3>`;

        grouped[date].forEach(task => {
            const card = document.createElement("div");
            card.className = `task-card priority-${task.priority} ${task.completed ? "completed" : ""}`;

            card.innerHTML = `
                <div class="task-left">
                    <input type="checkbox" ${task.completed ? "checked" : ""}>
                    <span class="task-text">${task.title}</span>
                </div>
                <button class="delete-btn">×</button>
            `;

            card.querySelector("input").addEventListener("change", e => {
                task.completed = e.target.checked;
                saveTasks();
                renderTasks();
                updateProgress();
            });

            card.querySelector(".delete-btn").addEventListener("click", () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
                updateProgress();
            });

            section.appendChild(card);
        });

        taskList.appendChild(section);
    });
}

/* ===== Helpers ===== */
function formatDate(dateStr) {
    const today = getTodayDate();
    if (dateStr === today) return "Today";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split("T")[0]) return "Tomorrow";

    return new Date(dateStr).toDateString();
}

/* ===== Add Task ===== */
function addTask() {
    const title = taskInput.value.trim();
    if (!title) return alert("Task cannot be empty");

    tasks.push({
        id: generateId(),
        title,
        completed: false,
        priority: prioritySelect.value,
        dueDate: dateInput.value || getTodayDate()
    });

    saveTasks();
    renderTasks();
    updateProgress();

    taskInput.value = "";
    dateInput.value = "";
}

/* ===== Events ===== */
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => e.key === "Enter" && addTask());

renderTasks();
updateProgress();
