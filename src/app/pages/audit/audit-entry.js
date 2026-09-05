import "../../../shared/styles/pages/audit.scss"

import AuditApp from "./audit-app.js";

class AuditEntry {
    constructor() {
        this.init()
    }
    init() {
        new AuditApp()

        console.log("[AuditEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new AuditEntry()
})