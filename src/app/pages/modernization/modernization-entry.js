import "../../../shared/styles/pages/modernization.scss"

import ModernizationApp from "./modernization-app.js";

class ModernizationEntry {
    constructor() {
        this.init()
    }
    init() {
        new ModernizationApp()

        console.log("[ModernizationEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ModernizationEntry()
})