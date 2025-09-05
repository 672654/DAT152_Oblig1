import config from './config.js'

async function main() {
    const url = `${config.servicesPath}/allstatuses`

    document.querySelector("span").textContent = url;
    const pre = document.querySelector("pre");

    try {
        const response = await fetch(url, { method: "GET" })
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

main()
