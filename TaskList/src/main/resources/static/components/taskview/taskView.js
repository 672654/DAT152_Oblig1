

import '../taskbox/taskbox.js';
import '../tasklist/tasklist.js';

const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskview.css"/>

  <h1>Tasks</h1>

  <div id="message"><p>Waiting for server data.</p></div>
  <div id="newtask">
    <button type="button" disabled>New task</button>
  </div>
  
  <!-- The task list -->
  <task-list></task-list>
  <!-- The Modal -->
  <task-box></task-box>
  `;




class TaskView extends HTMLElement {

  #tasklist;
  #taskbox;

  #serviceurl;

  #shadowroot;


  constructor() {
    super();



    this.#shadowroot = this.attachShadow({ mode: 'closed' });
    const content = template.content.cloneNode(true);
    this.#shadowroot.append(content);

    this.#tasklist = this.#shadowroot.querySelector("task-list");
    this.#taskbox = this.#shadowroot.querySelector("task-box");
    this.#serviceurl = this.getAttribute("data-serviceurl");



    this.#init();


  }

  /**
   * fetch tasks and statuses from server, setup eventlisteners.
   * @private
   */

  #init() {

    this.#getStatuses();
    this.fetchTasks();


    //Legger til eventlistener på knappen for å åpne dialog
    const button = this.#shadowroot.querySelector("#newtask button");
    button.addEventListener("click", () => {
      this.#taskbox.show();
    });


    //Legger til callback funksjon for å få data fra taskbox
    this.#taskbox.addNewTaskCallback((newTask) => {
      console.log(`Have '${newTask.title}' with status ${newTask.status}.`);
      //med eller uten bind? Arrowfunskjon bruker this fra omgivende scope så trenger ikke bind her.
      this.createTask(newTask);
      //this.createTask.bind(this)(newTask);
      this.#taskbox.close();
    });

    //Legger til callback funksjon for å få data fra tasklist
    this.#tasklist.changestatusCallback((id, newstatus) => {
      console.log(`Change status for task ${id} to ${newstatus}.`);
      this.updateTaskStatus(id, newstatus);
    });

    //Legger til callback funksjon for å få data fra tasklist
    this.#tasklist.deletetaskCallback(this.deleteTask.bind(this));
  }

  /**
     * Set the list of possible task statuses
     * @private
     * 
     */
  async #getStatuses() {

    try {
      const response = await fetch(`${this.#serviceurl}/allstatuses`);
      if (response.ok) {
        const responsedata = await response.json();

        console.log(responsedata.allstatuses);

        this.#tasklist.setStatuseslist(responsedata.allstatuses);
        this.#taskbox.setStatuseslist(responsedata.allstatuses);
      }
    }
    catch (error) {
      console.error("Error fetching task statuses:", error);
    }
  }

  /**
   * Delete a task by id
   * "/task/{taskId}"
   * @param {*} id 
   */
  async deleteTask(id) {

    const requestsetting = {
      "method": "DELETE",
      "headers": { "Content-Type": "application/json; charset=utf-8", "Accept": "application/json" },
      "body": null,
      "cache": "no-cache",
      "redirect": "error"
    };
    try {
      const response = await fetch(`${this.#serviceurl}/task/${id}`, requestsetting);
      if (response.ok) {
        const responsedata = await response.json();
        console.log("Task deleted:", responsedata);
        this.#tasklist.removeTask(id);
        this.#setMessage();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  async updateTaskStatus(id, newstatus) {

    const requestsetting = {
      "method": "PUT",
      "headers": { "Content-Type": "application/json; charset=utf-8", "Accept": "application/json" },
      "body": JSON.stringify({ "status": newstatus }),
      "cache": "no-cache",
      "redirect": "error"
    };


    try {
      const response = await fetch(`${this.#serviceurl}/task/${id}`, requestsetting);
      if (response.ok) {
        const responsedata = await response.json();
        console.log("Task updated:", responsedata);
        const updatedtask = { id: responsedata.id, status: responsedata.status };
        this.#tasklist.updateTask(updatedtask);


      }
    }
    catch (error) {
      console.error("Error updating task:", error);
    }


  }



  async createTask(task) {

    const requestsetting = {
      "method": "POST",
      "headers": { "Content-Type": "application/json; charset=utf-8", "Accept": "application/json" },
      "body": JSON.stringify(task),
      "cache": "no-cache",
      "redirect": "error"
    };

    console.log(`Request data: '${JSON.stringify(task)}'`);

    try {

      const response = await fetch(`${this.#serviceurl}/task`, requestsetting);
      if (response.ok) {
        const responsedata = await response.json();
        console.log("Task created:", responsedata);
        this.#tasklist.showTask(responsedata.task);
        this.#setMessage();
      }
    }
    catch (error) {
      console.error("Error creating task:", error);
    }
  }


  async fetchTasks() {

    const tasks = [];
    const response = await fetch(`${this.#serviceurl}/tasklist`);

    if (response.ok) {
      console.log("response.ok");
      const statuses = await response.json();
      tasks.push(...statuses.tasks);
      console.log(tasks);
      this.#shadowroot.querySelector("#newtask button").disabled = false;
    }


    tasks.forEach(t => {
      this.#tasklist.showTask(t);
    });

    this.#setMessage();

  }


  #setMessage() {
    const num = this.#tasklist.getNumtasks();

    if (num > 0) {
      this.#shadowroot.querySelector("#message").textContent = num + " Tasks loaded.";

    } else {
      this.#shadowroot.querySelector("#message").textContent = "No tasks were found.";

    }

  }

}






customElements.define('task-view', TaskView);


