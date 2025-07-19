let taskinput = document.querySelector("#taskinput");
let addtask = document.querySelector("#add-btn");
let tasklist = document.querySelector("ul");

// Helper: Save all tasks to localStorage
function updateLocalStorage() {
    const tasks = [];
    tasklist.querySelectorAll("li").forEach(li => {
        const span = li.querySelector("span");
        // Only save tasks that are not being edited
        if (span && !li.querySelector("input")) {
            tasks.push({
                text: span.textContent,
                completed: span.classList.contains("completed")
            });
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Helper: Add a task to the DOM
function addTaskToDOM(task, completed = false) {
    const newtask = document.createElement("li");

    const tasktext = document.createElement("span");
    tasktext.textContent = task;
    if (completed) tasktext.classList.add("completed");

    const deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";
    deletebtn.addEventListener("click", function () {
        newtask.remove();
        updateLocalStorage();
    });

    // Toggle completed
    tasktext.addEventListener("click", function () {
        tasktext.classList.toggle("completed");
        updateLocalStorage();
    });

    // Edit task
    tasktext.addEventListener("dblclick", function () {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = tasktext.textContent;
        newtask.replaceChild(editInput, tasktext);
        editInput.focus();

        function saveEdit() {
            if (editInput.value.trim() !== "") {
                tasktext.textContent = editInput.value.trim();
                updateLocalStorage();
            }
            newtask.replaceChild(tasktext, editInput);
        }

        editInput.addEventListener("blur", saveEdit);
        editInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") saveEdit();
        });
    });

    newtask.appendChild(tasktext);
    newtask.appendChild(deletebtn);
    tasklist.appendChild(newtask);
}

addtask.addEventListener("click", function () {
    const task = taskinput.value.trim();
    if (task === "") {
        alert("Your task is empty!");
        return;
    }
    addTaskToDOM(task);
    updateLocalStorage();
    taskinput.value = "";
});

window.addEventListener("load", function () {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach((task) => {
        addTaskToDOM(task.text, task.completed);
    });
});



