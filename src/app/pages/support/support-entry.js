import "../../../shared/styles/pages/support.scss"

import SupportApp from "./support-app.js";

class SupportEntry {
    constructor() {
        this.init()
    }
    init() {
        new SupportApp()

        console.log("[SupportEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new SupportEntry()
})