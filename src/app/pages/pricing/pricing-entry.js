import "../../../shared/styles/pages/pricing.scss"

import PricingApp from "./pricing-app.js";

class PricingEntry {
    constructor() {
        this.init()
    }
    init() {
        new PricingApp()

        console.log("[PricingEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PricingEntry()
})