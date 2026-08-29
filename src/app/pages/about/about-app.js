/*
=====================================================
K·ART·MAKE V5.2

HOME APP

Home page application bootstrap.

GLOBAL MODULES ARE NOT INITIALIZED HERE.

Global:
- ScrollEngine
- DashboardMenu
- TransitionLoader
- AnchorNavigation
- CookieController
- ModalController

Home:
- ArchitectureBuilder
- AuditEngine
- Terminal
- MonitoringScroll
- PipelineScroll
- SolutionsEngine
- SceneRegistry
- ContactScroll

=====================================================
*/

import HeroParticleAssembly from "../../modules/global/hero-particle-assembly.js"
import CanvasEngine from "../../modules/global/canvas-engine";
import SceneManager from "../../modules/global/scene-manager";
import OrbitNavigation from "../../modules/global/orbit-navigation.js"
import AboutIntro from "../../modules/about/about-intro";

export default class AboutApp {
    constructor() {
        this.modules = {}
        /*
        =====================================================
        HOME MODULE REGISTRY
        =====================================================
        */
        this.registry = {
            CanvasEngine,
            SceneManager,
            HeroParticleAssembly,
            OrbitNavigation,
            AboutIntro,
        }
        this.init()
    }

    /*
    =====================================================
    INIT
    =====================================================
    */
    init() {
        /*
        -----------------------------------------------------
        IMPORTANT

        GlobalApp has already created window.App.

        We DO NOT do:

            window.App = {}

        because that would destroy global modules.
        -----------------------------------------------------
        */
        if (!window.App) {
            console.warn("[HomeApp] window.App does not exist. GlobalApp may not be initialized.")
            window.App = {}
        }
        /*
        -----------------------------------------------------
        Initialize Home modules
        -----------------------------------------------------
        */
        for (const [name, Module] of Object.entries(this.registry)) {
            const instance = new Module()
            this.modules[name] = instance
            window.App[name] = instance
        }
        /*
        -----------------------------------------------------
        Register scenes in SceneManager
        -----------------------------------------------------
        */
        this.startExperience()
        console.log("[HomeApp] initialized")
    }

    startExperience() {
        this.modules.SceneManager.start()
        ScrollTrigger.refresh()
    }
}
