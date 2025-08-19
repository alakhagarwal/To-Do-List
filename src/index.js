import "./style.css";

class Project {
  constructor(title, todos = []) {
    this.title = title;
    this.todos = todos;
  }

  addtodo(todo) {
    this.todos.push(todo);
  }
}

class Todo {
  constructor(title, description, dueDate, priority, status = false) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
  }
}

const toggleSidebar = document.querySelector(".toggleSidebar");

toggleSidebar.addEventListener("click", () => {
  const sidebar = document.querySelector(".left-panel");
  sidebar.classList.toggle("show");
  // sidebar.remove();
});

const sidebarCloseIcon = document.querySelector(".close-icon");

sidebarCloseIcon.addEventListener("click", () => {
  const sidebar = document.querySelector(".left-panel");
  sidebar.classList.remove("show");
});

// write function to load project from local storage..project is an array of class instances
function loadProjects() {
  const saved = localStorage.getItem("projects");
  if (!saved) {
    return [];
  }
  const savedProjects = JSON.parse(saved);

  return savedProjects.map((project) => {
    const Todos = project.todos.map(
      (todo) =>
        new Todo(
          todo.title,
          todo.description,
          new Date(todo.dueDate),
          todo.priority,
          todo.status
        )
    );
    return new Project(project.title, Todos);
  });
}

function saveProjects() {
  const projectsJSON = JSON.stringify(projects);
  localStorage.setItem("projects", projectsJSON);
}

let projects;

window.onload = function () {
  projects = loadProjects();
  DisplayAllProjects();
  const clickEvent = new Event("click");
  showAllProjectsToggle.dispatchEvent(clickEvent); // <-- This line triggers the click and makes it active
  // Rest of your code...
};

let currProject = null;

const projectFormtoggle = document.querySelector(".toggleProjectform");
const projectForm = document.querySelector(".project-form");
const ProjectList = document.querySelector(".project-list");
const todoList = document.querySelector(".todos-list");

function displayNewTodo() {
  todoList.innerHTML = "";

  if (!currProject) {
    return;
  }

  for (let todo of currProject.todos) {
    const mainTaskDiv = document.createElement("div");
    const TaskDiv = document.createElement("div");
    TaskDiv.classList.add("task");
    const info = document.createElement("div");
    info.classList.add("info");
    const checkBox = document.createElement("div");
    checkBox.classList.add("checkbox");
    const title = document.createElement("span");
    title.textContent = todo.title;
    info.appendChild(checkBox);
    info.appendChild(title);

    const todoInfo = document.createElement("div");
    todoInfo.classList.add("todo-info");

    // Create detailed info with icons
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("todo-detail");
    descriptionDiv.innerHTML = `
                <i class="fas fa-align-left"></i>
                <span><strong>Description:</strong> ${todo.description}</span>
            `;

    const dueDateDiv = document.createElement("div");
    dueDateDiv.classList.add("todo-detail");
    dueDateDiv.innerHTML = `
                <i class="fas fa-calendar"></i>
                <span><strong>Due Date:</strong> ${new Date(
                  todo.dueDate
                ).toLocaleDateString()}</span>
            `;

    const priorityDiv = document.createElement("div");
    priorityDiv.classList.add("todo-detail");
    const priorityClass = `priority-${todo.priority}`;
    priorityDiv.innerHTML = `
                <i class="fas fa-flag ${priorityClass}"></i>
                <span><strong>Priority:</strong> <span class="${priorityClass}">${todo.priority.toUpperCase()}</span></span>
            `;

    todoInfo.appendChild(descriptionDiv);
    todoInfo.appendChild(dueDateDiv);
    todoInfo.appendChild(priorityDiv);

    // Show/hide info when clicking the task (excluding checkbox and delete icon)
    TaskDiv.addEventListener("click", (e) => {
      // Prevent toggling when clicking checkbox
      todoInfo.classList.toggle("show-info");
    });

    const deleteTodo = document.createElement("i");
    deleteTodo.classList.add("fa-solid");
    deleteTodo.classList.add("fa-xmark");

    TaskDiv.appendChild(info);
    TaskDiv.appendChild(deleteTodo);
    mainTaskDiv.appendChild(TaskDiv);
    mainTaskDiv.appendChild(todoInfo);

    if (todo.status) {
      checkBox.classList.add("checked");
      checkBox.textContent = "✓";
    }

    todoList.appendChild(mainTaskDiv);

    checkBox.addEventListener("click", (event) => {
      event.stopPropagation();
      todo.status = !todo.status;

      if (todo.status) {
        checkBox.classList.add("checked");
        checkBox.textContent = "✓";
      } else {
        checkBox.classList.remove("checked");
        checkBox.textContent = " ";
      }
      saveProjects();
    });

    deleteTodo.addEventListener("click", (event) => {
      event.stopPropagation();
      currProject.todos = currProject.todos.filter((t) => t !== todo);
      displayNewTodo();
      saveProjects();
    });
  }
}

function displayNewProject(project) {
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project");
  projectDiv.classList.add("optn");
  const Para = document.createElement("p");
  Para.textContent = project.title;
  const deleteProject = document.createElement("i");
  deleteProject.classList.add("fa-solid");
  deleteProject.classList.add("fa-trash");
  projectDiv.appendChild(Para);
  projectDiv.appendChild(deleteProject);
  ProjectList.appendChild(projectDiv);

  //adding event listener or delete icon

  projectDiv.addEventListener("click", () => {
    addTaskForm.classList.remove("show");
    const projectDivs = document.querySelectorAll(".optn");
    projectDivs.forEach((p) => {
      p.classList.remove("active");
    });

    currProject = project;

    projectDiv.classList.add("active");

    displayNewTodo(); // check the working of delete button
  });

  deleteProject.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent project selection when deleting

    // Remove project from array
    projects = projects.filter((p) => p !== project);

    // Remove from DOM
    projectDiv.remove();

    // Clear current project if it was deleted
    if (currProject === project) {
      currProject = null;
      todoList.innerHTML = "";
    }

    saveProjects();
  });

  const clickEvent = new Event("click");
  projectDiv.dispatchEvent(clickEvent); // <-- This line triggers the click and makes it active
}

projectFormtoggle.addEventListener("click", () => {
  projectForm.classList.add("show");
});

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#project-title").value;
  const project = new Project(title);
  projects.push(project);
  projectForm.classList.remove("show");
  projectForm.reset();

  currProject = project;
  // console.log(currProject);
  // console.log(project);

  displayNewProject(project);
  saveProjects();
});

const addTaskToggle = document.querySelector(".add-task");
const addTaskForm = document.querySelector(".task-form");

addTaskToggle.addEventListener("click", () => {
  if (currProject === null) {
    alert("Please select a project first");
    return; // stops the function from executing further if the project is not selected.
  }
  addTaskForm.classList.add("show");
});

addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#task-title").value;
  const description = document.querySelector("#task-description").value;
  const dueDate = document.querySelector("#task-due-date").value;
  const priority = document.querySelector("#task-priority").value;
  const now = new Date();
  const taskDate = new Date(dueDate);

  if (taskDate > now) {
    addTaskForm.classList.remove("show");
    addTaskForm.reset();

    const todo = new Todo(title, description, dueDate, priority);
    // console.log(todo);
    currProject.addtodo(todo);
    displayNewTodo();
    saveProjects();
  } else {
    alert("Due date should be in the future");
  }
});

const showAllProjectsToggle = document.querySelector(".all");

showAllProjectsToggle.addEventListener("click", () => {
  addTaskForm.classList.remove("show");
  const projectDivs = document.querySelectorAll(".optn");
  projectDivs.forEach((p) => {
    p.classList.remove("active");
  });
  showAllProjectsToggle.classList.add("active");
  currProject = null;
  todoList.innerHTML = "";

  for (let project of projects) {
    for (let todo of project.todos) {
      const mainTaskDiv = document.createElement("div");
      const TaskDiv = document.createElement("div");
      TaskDiv.classList.add("task");
      const info = document.createElement("div");
      info.classList.add("info");
      const checkBox = document.createElement("div");
      checkBox.classList.add("checkbox");
      const title = document.createElement("span");
      title.textContent = todo.title;
      info.appendChild(checkBox);
      info.appendChild(title);

      const todoInfo = document.createElement("div");
      todoInfo.classList.add("todo-info");

      // Create detailed info with icons
      const descriptionDiv = document.createElement("div");
      descriptionDiv.classList.add("todo-detail");
      descriptionDiv.innerHTML = `
                <i class="fas fa-align-left"></i>
                <span><strong>Description:</strong> ${todo.description}</span>
            `;

      const dueDateDiv = document.createElement("div");
      dueDateDiv.classList.add("todo-detail");
      dueDateDiv.innerHTML = `
                <i class="fas fa-calendar"></i>
                <span><strong>Due Date:</strong> ${new Date(
                  todo.dueDate
                ).toLocaleDateString()}</span>
            `;

      const priorityDiv = document.createElement("div");
      priorityDiv.classList.add("todo-detail");
      const priorityClass = `priority-${todo.priority}`;
      priorityDiv.innerHTML = `
                <i class="fas fa-flag ${priorityClass}"></i>
                <span><strong>Priority:</strong> <span class="${priorityClass}">${todo.priority.toUpperCase()}</span></span>
            `;

      todoInfo.appendChild(descriptionDiv);
      todoInfo.appendChild(dueDateDiv);
      todoInfo.appendChild(priorityDiv);

      // Show/hide info when clicking the task (excluding checkbox and delete icon)
      TaskDiv.addEventListener("click", (e) => {
        // Prevent toggling when clicking checkbox
        todoInfo.classList.toggle("show-info");
      });

      const deleteTodo = document.createElement("i");
      deleteTodo.classList.add("fa-solid");
      deleteTodo.classList.add("fa-xmark");

      TaskDiv.appendChild(info);
      TaskDiv.appendChild(deleteTodo);
      mainTaskDiv.appendChild(TaskDiv);
      mainTaskDiv.appendChild(todoInfo);

      if (todo.status) {
        checkBox.classList.add("checked");
        checkBox.textContent = "✓";
      }

      todoList.appendChild(mainTaskDiv);

      checkBox.addEventListener("click", (event) => {
        event.stopPropagation(); // doesnt carry the event to the parent element
        todo.status = !todo.status;

        if (todo.status) {
          checkBox.classList.add("checked");
          checkBox.textContent = "✓";
        } else {
          checkBox.classList.remove("checked");
          checkBox.textContent = " ";
        }
        saveProjects();
      });

      deleteTodo.addEventListener("click", (event) => {
        event.stopPropagation();
        project.todos = project.todos.filter((t) => t !== todo);
        const clickEvent = new Event("click");
        showAllProjectsToggle.dispatchEvent(clickEvent);
        saveProjects();
      });
    }
  }
});

function DisplayAllProjects() {
  ProjectList.innerHTML = "";
  console.log(projects);
  for (let project of projects) {
    displayNewProject(project);
  }
}
