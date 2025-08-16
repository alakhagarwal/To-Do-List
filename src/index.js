import "./style.css";

class Project {
  constructor(title) {
    this.title = title;
    this.todos = [];
  }

  addtodo(todo) {
    this.todos.push(todo);
  }
}

class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = false;
  }
}

let projects = [];
let currProject;

const projectFormtoggle = document.querySelector(".toggleProjectform");
const projectForm = document.querySelector(".project-form");
const ProjectList = document.querySelector(".project-list");
const todoList = document.querySelector(".todos-list");


function displayNewTodo() {
  todoList.innerHTML = "";

  for (let todo of currProject.todos) {
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

    const deleteTodo = document.createElement("i");
    deleteTodo.classList.add("fa-solid");
    deleteTodo.classList.add("fa-xmark");

    TaskDiv.appendChild(info);
    TaskDiv.appendChild(deleteTodo);

    if (todo.status) {
      TaskDiv.classList.add("checked");
    }

    todoList.appendChild(TaskDiv);

    checkBox.addEventListener("click", () => {
      todo.status = !todo.status;

      if (todo.status) {
        checkBox.classList.add("checked");
        checkBox.textContent = "✓";
      } else {
        checkBox.classList.remove("checked");
        checkBox.textContent = " ";
      }
    });


    deleteTodo.addEventListener("click", () => {
      currProject.todos = currProject.todos.filter((t) => t !== todo);
      // removes the todo from the array
      displayNewTodo();
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
  deleteProject.addEventListener("click", () => {
    projects.splice(projects.indexOf(project), 1);
    projectDiv.remove(); // deletes it from the DOM

    if (currProject === project) {
      currProject = null;
    }
  });

  projectDiv.addEventListener("click", () => {
    const projectDivs = Array.from(ProjectList.children);
    projectDivs.forEach((p) => {
      p.classList.remove("active");
    });

    currProject = project;
    projectDiv.classList.add("active");

    displayNewTodo(); // check the working of delete button
  });
  displayNewTodo();

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


  currProject = projects[projects.length - 1];
  console.log(currProject);
  console.log(projects[projects.length - 1]);

  displayNewProject(projects[projects.length - 1]);

});

const addTaskToggle = document.querySelector(".add-task");
const addTaskForm = document.querySelector(".task-form");

addTaskToggle.addEventListener("click", () => {
  addTaskForm.style.display = "block";
  addTaskForm.classList.add("show");
});

addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#task-title").value;
  const description = document.querySelector("#task-description").value;
  const dueDate = document.querySelector("#task-due-date").value;
  const priority = document.querySelector("#task-priority").value;

  addTaskForm.classList.remove("show");
  addTaskForm.reset();

  const todo = new Todo(title, description, dueDate, priority);
  console.log(todo);
  currProject.addtodo(todo);
  displayNewTodo();
});
