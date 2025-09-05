import config from './config.js';

class PutData {
    #rootElement;

    constructor(rootElement) {
        this.#rootElement = rootElement;
        this.#rootElement.querySelector("button").addEventListener("click", () => { this.getData() })
    }

    async put(task) {
        const url = `${config.servicesPath}/task/${task.taskid}`;
        document.querySelector("span").textContent = url;
        const pre = document.querySelector("pre");

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({ 'status': task.status })
            })
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
        const status = this.#rootElement.querySelector("select").value;
        if (status === "0") return;
        const taskid = this.#rootElement.querySelector("input").value.trim();
        if (taskid === "") return;

        const task = {
            'taskid': taskid,
            'status': status
        };
        this.put(task);
    }
}

const rootElement = document.getElementById("root");
new PutData(rootElement);
