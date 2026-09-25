import "../../../shared/styles/pages/cases.scss"

import CasesApp from "./cases-app.js";

class CasesEntry {
    constructor() {
        this.init()
    }
    init() {
        new CasesApp()

        console.log("[CasesEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new CasesEntry()
})