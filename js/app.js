$(document).ready(function () {
  /* define constants */
  const form = document.querySelector("#form");
  const formSection = document.querySelector(".form");
  const formHeader = document.querySelector(".header");

  const addNewTaskBtn = document.querySelector("#add-new-task-btn");
  const filterDoneBtn = document.querySelector("#filter-done-btn");
  const filterUndoneBtn = document.querySelector("#filter-undone-btn");
  const removeAllBtn = document.querySelector("#remove-all-btn");
  const removeFinishedBtn = document.querySelector("#remove-finished-btn");
  const filtersResetBtn = document.querySelector("#filters-reset-btn");

  const liToClone = document.querySelector("#li-to-clone");
  const taskList = document.querySelector("#task-list");
  const priorities = document.querySelector("#filter-priority");
  const filterPriorityForm = document.querySelector("#filter_priority");

  /* function definitions */
  // get list from local storage and convert from json to array

  function parseJsonFromLS() {
    let taskArrayJSON = localStorage.getItem("todolist");

    let htmlArray = [];
    if (taskArrayJSON) {
      htmlArray = JSON.parse(taskArrayJSON);
    }
    return htmlArray;
  }

  // get list from local storage and add to html
  function getFromLS() {
    let taskArray = parseJsonFromLS();
    addArrayToHtml(taskArray);
    findAllButtons();
  }

  // refresh events on all buttons
  function findAllButtons() {
    findShowDescriptionButtons();
    findCompleteTaskButtons();
    findDeleteButtons();
  }

  // pass object array to an html list
  function addArrayToHtml(arr) {
    // clear html before reloading list
    taskList.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
      addObjectToHtml(arr[i]);
    }
  }

  // add new tag from object to html
  function addObjectToHtml(taskObject) {
    let liCloned = liToClone.cloneNode(true);

    liCloned.classList.remove("hidden-always");
    liCloned.removeAttribute("id");

    if (taskObject.taskDone) {
      liCloned.classList.add("done");
    }

    liCloned.querySelector(".task-name").innerText = taskObject.taskName;
    liCloned.querySelector(".task-date").innerText = taskObject.taskDate;
    liCloned.querySelector(".task-priority").innerText =
      taskObject.taskPriority;
    liCloned.querySelector(".task-description").innerText =
      taskObject.taskAbout;
    liCloned.querySelector(".task-id").innerText = taskObject.taskId;

    taskList.appendChild(liCloned);
  }

  // validation
  function generateID() {
    /* https://qawithexperts.com/questions/242/how-to-generate */
    return "_" + Math.random().toString(36).substring(6);
  }

  function formValidateAndSubmit(event) {
    event.preventDefault();

    let taskInput = document.querySelector("#task-input");
    let dateInput = document.querySelector("#date-input");
    let priorities = document.getElementsByName("form-priority");
    let textAreaInput = document.querySelector("#textarea-input");

    let error = document.querySelector("#error-message");
    error.innerText = "";
    let formValid = true;

    let taskPriority;
    for (let i = 0; i < 5; i++) {
      if (priorities[i].checked) {
        taskPriority = priorities[i].value;
      }
    }

    let getTaskId = generateID();

    // get a time when a task is added;
    let getTaskOrder = [];
    getTaskOrder += new Date();
    console.log(getTaskOrder);

    // task subject

    if (taskInput.value.length <= 0) {
      formValid = false;
      error.innerText += "- enter a task's title \n";
    }
    if (taskInput.value.length > 25) {
      formValid = false;
      error.innerText += "- a title can't be longer than 25 characters \n";
    }

    /* priorities */
    let checkboxCheckedNumber = 0;

    for (let i = 0; i < priorities.length; i++) {
      if (priorities[i].checked) {
        checkboxCheckedNumber += 1;
      }
    }
    if (!checkboxCheckedNumber) {
      error.innerText += "- choose priority \n";
      formValid = false;
    }

    //text area

    if (textAreaInput.value.length > 100) {
      formValid = false;
      error.innerText +=
        "- a task's description can't be longer than 100 characters \n";
    }

    // validate form

    if (formValid) {
      createNewTaskObject(
        getTaskId,
        taskInput.value,
        dateInput.value,
        textAreaInput.value,
        taskPriority
      );
      closeForm();
      form.reset();
    }
  }

  form.addEventListener("submit", formValidateAndSubmit);

  // hide form after validating
  function closeForm() {
    accordionClose(formSection);
    accordionHeader(formHeader);
    changeBtnTxt(addNewTaskBtn);
    changeBtnClass(addNewTaskBtn);
  }

  // update LS table
  function addArrayToLS(arr) {
    let arrayJSON = JSON.stringify(arr);
    localStorage.setItem("todolist", arrayJSON);

    getFromLS();
  }

  // create a new object
  function createNewTaskObject(
    addId,
    addTask,
    addDate,
    addDescription,
    addPriority
  ) {
    let newTaskObject = {
      taskId: addId,
      taskName: addTask,
      taskDate: addDate,
      taskPriority: addPriority,
      taskAbout: addDescription,
      taskDone: false,
    };

    let taskArray = parseJsonFromLS();

    // add new array to LS
    let newArrToLS = [];
    newArrToLS = newArrToLS.concat(taskArray);
    newArrToLS.push(newTaskObject);

    addArrayToLS(newArrToLS);
  }

  // delete individual tasks

  function deleteTask() {
    let taskId =
      this.parentElement.parentElement.parentElement.querySelector(".task-id");

    // remove object from main array in LS
    deleteTaskFromArray(taskId);
  }

  function findDeleteButtons() {
    let deleteTaskButtons = document.querySelectorAll(".task-delete");
    for (let i = 0; i < deleteTaskButtons.length; i++) {
      deleteTaskButtons[i].addEventListener("click", deleteTask);
    }
  }

  // remove object tag from id
  function deleteTaskFromArray(id) {
    let taskArray = parseJsonFromLS();

    /* copy array from LS */
    let newArrToLS = taskArray.slice();

    for (let j = 0; j < newArrToLS.length; j++) {
      if (newArrToLS[j].taskId === id.innerText) {
        newArrToLS.splice(j, 1);

        addArrayToLS(newArrToLS);
      }
    }
  }

  // mark complete buttons

  function findCompleteTaskButtons() {
    let completeTaskButtons = document.querySelectorAll(".task-complete");

    for (let j = 0; j < completeTaskButtons.length; j++) {
      completeTaskButtons[j].addEventListener("click", markAsCompleted);
    }
  }

  function markAsCompleted() {
    let taskId =
      this.parentElement.parentElement.parentElement.querySelector(".task-id");
    let taskArray = parseJsonFromLS();

    let newArrToLS = taskArray.slice();

    for (let i = 0; i < newArrToLS.length; i++) {
      if (newArrToLS[i].taskId === taskId.innerText) {
        newArrToLS[i].taskDone = !newArrToLS[i].taskDone;
      }
    }

    // add updated table to LS
    addArrayToLS(newArrToLS);
  }

  // task details button

  function findShowDescriptionButtons() {
    let showDescriptionButtons = document.querySelectorAll(".task-show");

    for (let i = 0; i < showDescriptionButtons.length; i++) {
      showDescriptionButtons[i].addEventListener("click", showDescriptionPanel);
    }
  }

  function showDescriptionPanel() {
    let taskDescriptionPanel =
      this.parentElement.parentElement.parentElement.querySelector(
        ".task-description-panel"
      );

    taskDescriptionPanel.classList.toggle("accordion-list-active");

    if (taskDescriptionPanel.style.maxHeight) {
      taskDescriptionPanel.style.maxHeight = null;
    } else {
      taskDescriptionPanel.style.maxHeight =
        taskDescriptionPanel.scrollHeight + "px";
    }
  }
});
