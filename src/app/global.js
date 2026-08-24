import ScrollEngine from "./core/scroll-engine.js"

import AnchorNavigation from "./modules/global/anchor-navigation.js"
import DashboardMenu from "./modules/global/dashboard-menu.js"
import TransitionLoader from "./modules/global/transition-loader.js"
import CookieController from "./modules/global/cookie-controller.js"
import ModalController from "./modules/global/modal.js"

export default class GlobalApp {
    constructor() {
        this.modules = {}
        this.registry = {
            ScrollEngine,
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
        for (const name in this.registry) {
            const Module = this.registry[name]
            const instance = new Module()

            this.modules[name] = instance
            window.App[name] = instance
        }

        document.body.classList.add('document-ready')
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new GlobalApp()
})
