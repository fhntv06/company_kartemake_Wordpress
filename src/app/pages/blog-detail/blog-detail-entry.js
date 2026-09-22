import "../../../shared/styles/pages/blog-detail.scss"

import BlogDetailApp from "./blog-detail-app.js";

class BlogDetailEntry {
    constructor() {
        this.init()
    }
    init() {
        new BlogDetailApp()

        console.log("[BlogDetailEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new BlogDetailEntry()
})