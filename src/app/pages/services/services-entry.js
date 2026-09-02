import "../../../shared/styles/pages/services.scss"

import ServicesApp from "./services-app.js";

class ServicesEntry {
    constructor() {
        this.init()
    }
    init() {
        new ServicesApp()

        console.log("[ServicesEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ServicesEntry()
})