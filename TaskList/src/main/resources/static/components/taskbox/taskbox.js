

const template = document.createElement("template");
template.innerHTML = `
 <!-- <link rel="stylesheet" type="text/css"href="${import.meta.url.match(/.*\//)[0]}/taskbox.css"/> -->
  <dialog>
    <!-- Modal content -->
    <span>&times;</span>
    <div>
      <div>Title:</div>
    <div>
    <input type="text" size="25" maxlength="80" placeholder="Task title" autofocus/>
    </div>
      <div>Status:</div><div><select></select></div>
    </div>
    <p><button type="submit">Add task</button></p>
  </dialog>
  `;

class TaskBox extends HTMLElement {

  #addNewTaskCallback;
  _statuses;

  constructor() {
    super();

    this._shadowroot = this.attachShadow({ mode: 'closed' });
    const content = template.content.cloneNode(true);
    this._shadowroot.append(content);

    //opprett variabler
    this._dialog = this._shadowroot.querySelector("dialog");
    this._span = this._shadowroot.querySelector("span");


    this.#addNewTaskCallback = null;


    if (this._span) {
      this._span.addEventListener('click', () => this.close());
    }

    // Legg til eventlistener på knappen
    const button = this._shadowroot.querySelector("button");
    button.addEventListener("click", (e) => {
      //Bruker preventdefault, standard er å sende inn skjema...
      e.preventDefault();
      const title = this._shadowroot.querySelector("input").value;
      const status = this._shadowroot.querySelector("select").value;
      console.log(`Add task '${title}' with status ${status}.`);
      if (this.#addNewTaskCallback) {
        const task = {
          "title": title,
          "status": status
        };
        this.#addNewTaskCallback(task);
      }
    });



  }

  /**
   * Opens (shows) the modal box in the browser window.
   * @public
   */
  show() {

    this._dialog.showModal();

  }




  /**
   * Sets the list of possible task statuses.
   * @param {*} list 
   */
  setStatuseslist(list) {
    this._statuses = list;
    console.log("Statuses in taskbox: " + this._statuses.join(", "));

    this._statuses.forEach(t => {
      const option = document.createElement("option");
      option.value = t;
      option.textContent = t;
      this._shadowroot.querySelector("select").append(option);
    });
  }





  /**
   * Adds a callback to run at click on the Add task button. New task as parameter
   * @param {*} callback 
   */
  addNewTaskCallback(callback) {
    //TODO
    this.#addNewTaskCallback = callback;
    console.log("Callback er initialisert med " + this.#addNewTaskCallback);

  }



  /**
   * Removes the modal box from the view
   * @public
   */
  close() {

    console.log("Close the task box");

    this._dialog.close();

  }







}

customElements.define('task-box', TaskBox);

