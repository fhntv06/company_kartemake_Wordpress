import '../../../shared/styles/pages/calculator.scss'

import CalculatorApp from "./calculator-app.js"

class CalculatorEntry {
    constructor() {
        this.init()
    }

    init() {
        new CalculatorApp()

        console.log("[CalculatorEntry] initialized")
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new CalculatorEntry()
})