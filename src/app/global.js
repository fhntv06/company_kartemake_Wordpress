import "../shared/styles/global.scss"

import ScrollEngine from "./core/scroll-engine.js"
import GSAPEngine from "./core/gsap-engine.js";
import CanvasEngine from "./modules/global/canvas-engine.js";
import SceneManager from "./modules/global/scene-manager.js";
import AnchorNavigation from "./modules/global/anchor-navigation.js"
import DashboardMenu from "./modules/global/dashboard-menu.js"
import TransitionLoader from "./modules/global/transition-loader.js"
import CookieController from "./modules/global/cookie-controller.js"
import ModalController from "./modules/global/modal.js"
import GlobalVariables from "./modules/global/variables";
export default class GlobalApp {
    constructor() {
        this.modules = {}
        this.beforeRegistry = {
            GlobalVariables,
            ScrollEngine, // load first !important
            GSAPEngine, // load second !important
        }
        this.registry = {
            CanvasEngine,
            SceneManager,
            AnchorNavigation,
            DashboardMenu,
            TransitionLoader,
            CookieController,
            ModalController
        }

        window.App = {}

        this.init()
    }

    init() {
        const modules = { ...this.beforeRegistry, ...this.registry }
        for (const name in modules) {
            const Module = modules[name]
            const instance = new Module()

            this.modules[name] = instance
            window.App[name] = instance
        }

        this.startExperience()

        document.body.classList.add('document-ready')
    }
    startExperience() {
        this.modules.SceneManager.start()
        ScrollTrigger.refresh()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new GlobalApp()
})
