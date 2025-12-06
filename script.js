document.addEventListener("DOMContentLoaded", () => {

    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const tasksList = document.getElementById("task-list");

    const emptyImage = document.querySelector(".empty");

    const progressBar = document.getElementById("progress");
    const progressNumber = document.getElementById("numbers");

    // ---------------------------
    // Toggle empty image
    // ---------------------------
    const toggleEmptyImage = () => {
        emptyImage.style.display = tasksList.children.length === 0 ? "block" : "none";
    };

    // ---------------------------
    // Update Progress Bar
    // ---------------------------
    const updateProgressBar = () => {
        const total = tasksList.children.length;
        const completed = tasksList.querySelectorAll(".checkbox:checked").length;

        if (total === 0) {
            progressBar.style.width = "0%";
        } else {
            progressBar.style.width = `${(completed / total) * 100}%`;
        }

        progressNumber.textContent = `${completed} / ${total}`;

        if (total > 0 && completed === total) {
            confetti();
        }
    };

    // ---------------------------
    // Save to Local Storage
    // ---------------------------
    const saveTasksToLocalStorage = () => {
        const tasks = Array.from(tasksList.querySelectorAll("li")).map(li => ({
            text: li.querySelector("span").textContent,
            completed: li.querySelector(".checkbox").checked
        }));

        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    // ---------------------------
    // Load Local Storage
    // ---------------------------
    const loadTasksFromLocalStorage = () => {
        const saved = JSON.parse(localStorage.getItem("tasks")) || [];

        saved.forEach(t => addTask(t.text, t.completed, false));

        updateProgressBar();
        toggleEmptyImage();
    };

    // ---------------------------
    // Add Task
    // ---------------------------
    const addTask = (text, completed = false) => {
        let taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".edit-btn");

        if (completed) {
            li.classList.add("completed");
            editBtn.style.opacity = "0.5";
            editBtn.disabled = true;
        }

        checkbox.addEventListener("change", () => {
            li.classList.toggle("completed", checkbox.checked);

            if (checkbox.checked) {
                editBtn.style.opacity = "0.5";
                editBtn.disabled = true;
            } else {
                editBtn.style.opacity = "1";
                editBtn.disabled = false;
            }

            updateProgressBar();
            saveTasksToLocalStorage();
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
            updateProgressBar();
            toggleEmptyImage();
            saveTasksToLocalStorage();
        });

        editBtn.addEventListener("click", () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector("span").textContent;
                li.remove();
                updateProgressBar();
                toggleEmptyImage();
                saveTasksToLocalStorage();
            }
        });

        tasksList.appendChild(li);
        taskInput.value = "";

        updateProgressBar();
        toggleEmptyImage();
        saveTasksToLocalStorage();
    };

    // ---------------------------
    // Event Listeners
    // ---------------------------
    addTaskButton.addEventListener("click", (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTask();
        }
    });

    // Load saved tasks
    loadTasksFromLocalStorage();
});
