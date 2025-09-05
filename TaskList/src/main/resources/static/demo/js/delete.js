import config from './config.js';

class DeleteTask {
    #rootElement;

    constructor(rootElement) {
        this.#rootElement = rootElement;
        
        this.#rootElement.querySelector("button").addEventListener("click", () => { this.getData() })
    }

    async deleteTask(taskid) {
        const url = `${config.servicesPath}/task/${taskid}`

        document.querySelector("span").textContent = url;
        const pre = document.querySelector("pre");

        try {
            const response = await fetch(url, { method: "DELETE" })
            try {
                const result = await response.json()
                pre.textContent = JSON.stringify(result, null, 4);
            } catch (error) {
                pre.textContent = error;
            }
        } catch (error) {
            pre.textContent = error;
        }
    }

    getData() {
        const taskid = this.#rootElement.querySelector("input").value.trim();
        if (taskid === "") return;
        this.deleteTask(taskid);
    }
}

const rootElement = document.getElementById("root");
new DeleteTask(rootElement);
