/*
=====================================================
K·ART·MAKE V5.2

HOME ENTRY

Home page entry point.

GLOBAL:
- Lenis
- GlobalApp
- DashboardMenu
- TransitionLoader
- AnchorNavigation
- CookieController
- ModalController

HOME:
- GSAP
- ScrollTrigger
- GSAPEngine
- HomeApp

=====================================================
*/
/*
=====================================================
HOME LIBRARIES
=====================================================
*/
// import "../../lib/gsap.min.js";
// import "../../lib/ScrollTrigger.min.js";

import "../../../shared/styles/pages/home.scss"

/*
=====================================================
HOME ENGINE
=====================================================
*/
// import GSAPEngine from "../../core/gsap-engine.js";
/*
=====================================================
HOME APP
=====================================================
*/
import HomeApp from "./home-app.js";
/*
=====================================================
BOOT
=====================================================
*/
class HomeEntry {
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
        new HomeApp();
        console.log("[HomeEntry] Home application started");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new HomeEntry()
})
