import config from './config.js';

class GetTask {
    #rootElement;

    constructor(rootElement) {
        this.#rootElement = rootElement;
        this.#rootElement.querySelector("button").addEventListener("click", () => { this.getData() })
    }

    async getTask(taskid) {
        const url = `${config.servicesPath}/task/${taskid}`

        document.querySelector("span").textContent = url;
        const pre = document.querySelector("pre");

        try {
            const response = await fetch(url, { method: "GET" });
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
        this.getTask(taskid);
    }
}

const rootElement = document.getElementById("root");
new GetTask(rootElement);
