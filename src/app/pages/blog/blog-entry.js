import "../../../shared/styles/pages/blog.scss"

import BlogApp from "./blog-app.js";

class BlogEntry {
    constructor() {
        this.init()
    }
    init() {
        /*
        -----------------------------------------------------
        GSAP must be initialized before Home modules.
        -----------------------------------------------------
        */
        // new GSAPEngine();
        /*
        -----------------------------------------------------
        Start Home application.
        -----------------------------------------------------
        */
        new BlogApp();
        console.log("[BlogEntry] Blog application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new BlogEntry()
})
