// Формирования Chunk общими для страниц классами

import HeroParticleAssembly from "./modules/global/hero-particle-assembly.js"
import OrbitNavigation from "./modules/global/orbit-navigation.js"

export default class PagesCommonApp {
    constructor() {
        this.modules = {}

        this.registry = {
            HeroParticleAssembly,
            OrbitNavigation,
        }

        this.init()
    }
    init() {
        if (!window.App) {
            console.warn("[HomeApp] window.App does not exist. GlobalApp may not be initialized.")
            window.App = {}
        }

        for (const name in this.registry) {
            const Module = this.registry[name]
            const instance = new Module()

            this.modules[name] = instance
            window.App[name] = instance
        }

        console.log("[PagesCommonApp] initialized")
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new PagesCommonApp()
})