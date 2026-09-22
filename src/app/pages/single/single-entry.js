import "../../../shared/styles/pages/single.scss"

import SingleApp from "./single-app.js";

class SingleEntry {
    constructor() {
        this.init()
    }
    init() {
        new SingleApp()

        console.log("[SingleEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new SingleEntry()
})