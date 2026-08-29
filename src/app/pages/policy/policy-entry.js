import "../../../shared/styles/pages/policy.scss"

import PolicyApp from "./policy-app.js";

class PolicyEntry {
    constructor() {
        this.init()
    }
    init() {
        new PolicyApp()

        console.log("[PolicyEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PolicyEntry()
})