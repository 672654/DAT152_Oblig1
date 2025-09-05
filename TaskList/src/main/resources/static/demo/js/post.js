import config from './config.js';

class PostData {
    #rootElement;

    constructor(rootElement) {
        this.#rootElement = rootElement;
        this.#rootElement.querySelector("button").addEventListener("click", () => { this.getData() })
    }

    async post(task) {
        const url = `${config.servicesPath}/task`;

        this.#rootElement.querySelector("span").textContent = url;
        const pre = this.#rootElement.querySelector("pre");

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(task)
            })
            try {
                const result = await response.json()
                pre.textContent = JSON.stringify(result, null, 4);

                this.#rootElement.querySelector("input").value = "";
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
        const title = this.#rootElement.querySelector("input").value.trim();
        if (title === "") return;

        const task = {
            'title': title,
            'status': status
        };
        this.post(task);
    }

}

const rootElement = document.getElementById("root");
new PostData(rootElement);

