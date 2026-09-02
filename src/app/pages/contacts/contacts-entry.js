import "../../../shared/styles/pages/contacts.scss"

import ContactsApp from "./contacts-app.js";

class ContactsEntry {
    constructor() {
        this.init()
    }
    init() {
        new ContactsApp()

        console.log("[ContactsEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ContactsEntry()
})