import "../../../shared/styles/pages/optimization.scss"

import OptimizationApp from "./optimization-app.js";

class OptimizationEntry {
    constructor() {
        this.init()
    }
    init() {
        new OptimizationApp()

        console.log("[OptimizationEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new OptimizationEntry()
})