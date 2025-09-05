const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/tasklist.css"/>

    <div id="tasklist"></div>`;

const tasktable = document.createElement("template");
tasktable.innerHTML = `
    <table>
        <thead><tr><th>Task</th><th>Status</th></tr></thead>
        <tbody></tbody>
    </table>`;

const taskrow = document.createElement("template");
taskrow.innerHTML = `
    <tr>
        <td></td>
        <td></td>
        <td>
            <select>
                <option value="0" selected>&lt;Modify&gt;</option>
            </select>
        </td>
        <td><button type="button">Remove</button></td>
    </tr>`;

/**
  * TaskList
  * Manage view with list of tasks
  */
class TaskList extends HTMLElement {

  constructor() {
    super();



    // Opprett shadow DOM
    const shadowroot = this.attachShadow({ mode: 'closed' });

    // referanse til shadowroot..
    this._shadowroot = shadowroot;

    //CSS
    const content = template.content.cloneNode(true);
    shadowroot.append(content);

    // lag en container som skal inneholde tabellen. conteineren er div tasklist.
    this._container = shadowroot.querySelector('#tasklist');

    // tbody blir satt når tabellen blir opprettet
    this._tbody = null;

    // Lagre callbacks
    this._changestatusCallback = null;
    this._deletetaskCallback = null;

    //liste over statuser som blir satt av annen klasse.
    this._statuses = [];
    // Opprett et objekt for å lagre referanser til task-rader
    //this._tasks = {};
    this._tasks = new Map();
  }

  /**
   * @public
   * @param {Array} list with all possible task statuses
   */
  setStatuseslist(allstatuses) {
    /**
     * Fill inn the code
     */

    //Set listen over statuser (this._statuses) lik parameteren allstatuses.
    if (allstatuses.length > 0) {
      this._statuses = allstatuses;
      //test med log i konsollen..
      console.log("Statuses set: " + this._statuses.join(", "));
    }

  }

  /**
   * Add callback to run on change on change of status of a task, i.e. on change in the SELECT element
   * @public
   * @param {function} callback
   */
  changestatusCallback(callback) {
    /**
     * Fill inn the code
     */
    //referanse til til funksjonen fra demo filen..
    this._changestatusCallback = callback;
  }

  /**
   * Add callback to run on click on delete button of a task
   * @public
   * @param {function} callback
   */
  deletetaskCallback(callback) {
    /**
     * Fill inn the code
     */
    this._deletetaskCallback = callback;
  }

  /**
   * Add task at top in list of tasks in the view
   * @public
   * @param {Object} task - Object representing a task
   */
  showTask(task) {

    // Hvis ingen tabell, lag tabell fra template tasktable og legg til i container
    // Deretter initialiser tbody med template sin <tbody>
    if (!this._tbody) {
      const tasktablecontent = tasktable.content.cloneNode(true);
      this._container.append(tasktablecontent);
      this._tbody = this._container.querySelector('tbody');
    }

    // Lag ny rad fra template
    const row = taskrow.content.cloneNode(true).querySelector('tr');

    //Fyll inn td med task sin title og status, index 0 og 1 i tds.
    const tds = row.querySelectorAll('td');
    tds[0].textContent = task.title;
    tds[1].textContent = task.status;

    // Få tak i select med statuser
    const select = row.querySelector('select');

    // Fyll inn select med statuser (option) på tasken
    this._statuses.forEach(status => {
      //Skulle ikke bruke createElement i følge oppgave, men ser ingen annen måte å gjøre dette på..
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      if (status === task.status) {
        option.selected = true;
      }
      select.appendChild(option);
    });



    // endre status. Når ny status velges fra nedtrekksmeny skjer en change event. 
    // Blir altså lagt til en event listener på hver task.
    select.addEventListener('change', () => {
      //Sjekk at ikke verdien er modify(0), og at det finnes en callback
      if (select.value !== '0' && this._changestatusCallback) {
        const confirmed = window.confirm(`Set '${task.title}' to '${select.value}'?`);
        if (confirmed) {
          this._changestatusCallback(task.id, select.value);
        } else {
          // hvis det ikke går, så settes select sin verdi til den opprinnelige statusen.
          select.value = task.status;
        }
      }
    });


    // slett task
    const button = row.querySelector('button');
    button.addEventListener('click', () => {
      if (this._deletetaskCallback) {
        const confim = window.confirm(`Delete task '${task.title}'`);
        if (confim) {
          this._deletetaskCallback(task.id);
        } else {
          //ingenting.
        }

      }
    });


    // Legg til rad øverst
    this._tbody.insertBefore(row, this._tbody.firstChild);
    //this._tasks[task.id] = row;
    this._tasks.set(task.id, row);

    //skriv ut for testing....
    console.log("task added: id:" + task.id + " , " + task.title + " ," + task.status);
    console.log("Number of tasks: " + this.getNumtasks());
  }

  /**
   * Update the status of a task in the view
   * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
   */
  updateTask(task) {
    /**
     * Fill inn the code
     */
    const id = task.id;
    const status = task.status;

    // Finn raden som skal oppdateres
    const row = this._tasks.get(id);

    // Oppdater status i raden
    const tds = row.querySelectorAll('td');
    tds[1].textContent = status;

    // Oppdater select med ny status
    const select = row.querySelector('select');
    select.value = status;

    console.log(`Tasklist.updateTask: Task ${id} updated to status '${status}'`);



  }

  /**
   * Remove a task from the view
   * @param {Integer} task - ID of task to remove
   */
  removeTask(id) {
    /**
     * Fill inn the code
     */
    const row = this._tasks.get(id);
    if (row) {
      this._tbody.removeChild(row);
      this._tasks.delete(id);
      // hvis ingen oppgaver igjen, fjern tabellen ved å sette container til tom streng.
      if (this.getNumtasks() === 0) {
        if (this._container) {
          this._container.textContent = '';
        }
        this._tbody = null;
      }
    }
  }

  /**
   * @public
   * @return {Number} - Number of tasks on display in view
   */
  getNumtasks() {
    /**
     * Fill inn the code
     */
    return this._tasks.size;

  }
}
customElements.define('task-list', TaskList);
