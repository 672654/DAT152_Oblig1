/**
 * Code below can be used to test the functionality of TaskList
 */

class TaskDemo {
  #tasklist

  constructor() {
    this.#tasklist = document.querySelector("task-list");

    this.#tasklist.changestatusCallback(
      (id, newStatus) => {
        console.log(`Status ${newStatus} for task ${id} approved`)
      }
    );

    this.#tasklist.deletetaskCallback(
      (id) => {
        console.log(`Delete of task ${id} approved`)
      }
    );

    const allstatuses = ["WAITING", "ACTIVE", "DONE"];
    this.#tasklist.setStatuseslist(allstatuses);

    const tasks = [
      {
        id: 1,
        status: "WAITING",
        title: "Paint roof"
      },
      {
        id: 2,
        status: "ACTIVE",
        title: "Wash windows"
      },
      {
        id: 3,
        status: "DONE",
        title: "Wash flooer"
      }
    ];

    for (let t of tasks) {
      this.#tasklist.showTask(t);
    }
  }

  newtask(id, title, status) {
    const newtask = {
      "id": id,
      "title": title,
      "status": status
    };
    this.#tasklist.showTask(newtask);
  }

  changestatus(id, status) {
    const newstatus = {
      "id": id,
      "status": status
    };
    this.#tasklist.updateTask(newstatus);
  }

  removetask(id) {
    this.#tasklist.removeTask(id);
  }
}

const demo = new TaskDemo();
demo.changestatus(1, "ACTIVE");
demo.newtask(5, "Do DAT152 home work", "ACTIVE");
demo.removetask(1);
