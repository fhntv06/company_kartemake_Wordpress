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
- CanvasEngine
- SceneManager
- ArchitectureBuilder
- AuditEngine
- Terminal
- MonitoringScroll
- OrbitNavigation
- PipelineScroll
- SolutionsEngine
- SceneRegistry
- ContactScroll
- HeroParticleAssembly

=====================================================
*/
import CanvasEngine from "../../modules/home/canvas-engine.js"
import SceneManager from "../../modules/home/scene-manager.js"
import ArchitectureBuilder from "../../modules/home/architecture-builder.js"
import AuditEngine from "../../modules/home/audit-engine.js"
import Terminal from "../../modules/home/terminal.js"
import MonitoringScroll from "../../modules/home/monitoring-scroll.js"
import OrbitNavigation from "../../modules/home/orbit-navigation.js"
import PipelineScroll from "../../modules/home/pipeline-scroll.js"
import SolutionsEngine from "../../modules/home/solutions-engine.js"
import SceneRegistry from "../../modules/home/scene-registry.js"
import ContactScroll from "../../modules/home/contact-scroll.js"
import HeroParticleAssembly from "../../modules/home/hero-particle-assembly.js"

export default class HomeApp {
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
            ArchitectureBuilder,
            AuditEngine,
            Terminal,
            MonitoringScroll,
            OrbitNavigation,
            PipelineScroll,
            SolutionsEngine,
            SceneRegistry,
            ContactScroll,
            HeroParticleAssembly
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
        this.registerScenes()
        this.startExperience()
        console.log("[HomeApp] initialized")
    }
    startExperience() {
        this.modules.SceneManager.start()
        ScrollTrigger.refresh()
    }
    /*
    =====================================================
    REGISTER SCENES
    =====================================================
    */
    registerScenes() {
        const sceneManager = this.modules.SceneManager
        if (!sceneManager) {
            console.warn("[HomeApp] SceneManager not found")
            return
        }
        /*
        -----------------------------------------------------
        AUDIT
        -----------------------------------------------------
        */
        sceneManager.register("audit", this.modules.AuditEngine)
        /*
        -----------------------------------------------------
        SOLUTIONS
        -----------------------------------------------------
        */
        sceneManager.register("solutions", this.modules.SolutionsEngine)
        /*
        -----------------------------------------------------
        ARCHITECTURE
        -----------------------------------------------------
        */
        sceneManager.register("architecture", this.modules.ArchitectureBuilder)
        /*
        -----------------------------------------------------
        PIPELINE
        -----------------------------------------------------
        */
        sceneManager.register("pipeline", this.modules.PipelineScroll)
        /*
        -----------------------------------------------------
        MONITORING
        -----------------------------------------------------
        */
        sceneManager.register("monitoring", this.modules.MonitoringScroll)
        /*
        -----------------------------------------------------
        CONTACT
        -----------------------------------------------------
        */
        sceneManager.register("contact", this.modules.ContactScroll)
        console.log("[HomeApp] scenes registered")
    }
}