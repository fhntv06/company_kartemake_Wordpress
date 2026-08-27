/*
=====================================================
K·ART·MAKE V5.2

GSAP ENGINE

Home page only.

Responsibilities:
- GSAP initialization
- ScrollTrigger registration
- Lenis → ScrollTrigger synchronization

=====================================================
*/
import "../lib/gsap.min.js";
import "../lib/ScrollTrigger.min.js";

export default class GSAPEngine {
    constructor() {
        console.log("[GSAPEngine] ready");
        this.init();
    }

    init() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            console.warn("[GSAPEngine] GSAP or ScrollTrigger is not loaded");
            return;
        }
        /*
        -----------------------------------------------------
        Register ScrollTrigger
        -----------------------------------------------------
        */
        gsap.registerPlugin(ScrollTrigger);
        /*
        -----------------------------------------------------
        Lenis → ScrollTrigger
        -----------------------------------------------------
        */
        if (window.lenis) {
            window.lenis.on("scroll", ScrollTrigger.update);
            console.log("[GSAPEngine] Lenis → ScrollTrigger connected");
        } else {
            console.warn("[GSAPEngine] Lenis not found");
        }
        /*
        -----------------------------------------------------
        GSAP ticker
        -----------------------------------------------------
        */
        gsap.ticker.lagSmoothing(0);
        console.log("[GSAPEngine] initialized");
    }
}
