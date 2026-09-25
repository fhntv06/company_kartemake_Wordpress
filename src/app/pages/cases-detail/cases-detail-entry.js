import "../../../shared/styles/pages/cases-detail.scss"

import CasesDetailApp from "./cases-detail-app.js";

class CasesDetailEntry {
    constructor() {
        this.init()
    }
    init() {
        new CasesDetailApp()

        console.log("[CasesDetailEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new CasesDetailEntry()
})