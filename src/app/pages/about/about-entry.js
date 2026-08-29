import '../../../shared/styles/pages/about.scss'

import AboutApp from "./about-app.js"

class AboutEntry {
    constructor() {
        this.init()
    }

    init() {
        new AboutApp()

        console.log("[AboutEntry] initialized")
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new AboutEntry()
})