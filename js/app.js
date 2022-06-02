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
});
