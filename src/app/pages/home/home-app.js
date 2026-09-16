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
- OrbitNavigation
- PipelineScroll
- SolutionsEngine
- SceneRegistry
- HeroParticleAssembly

=====================================================
*/
import ArchitectureBuilder from "../../modules/home/architecture-builder.js"
import AuditEngine from "../../modules/home/audit-engine.js"
import Terminal from "../../modules/home/terminal.js"
import PipelineScroll from "../../modules/home/pipeline-scroll.js"
import SolutionsEngine from "../../modules/home/solutions-engine.js"
import SceneRegistry from "../../modules/home/scene-registry.js"
import CostCalculator from "../../modules/home/cost-calculator.js";

export default class HomeApp {
    constructor() {
        this.modules = {}
        /*
        =====================================================
        HOME MODULE REGISTRY
        =====================================================
        */
        this.registry = {
            ArchitectureBuilder,
            AuditEngine,
            Terminal,
            PipelineScroll,
            SolutionsEngine,
            SceneRegistry,
            CostCalculator,
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
        console.log("[HomeApp] initialized")
    }
    /*
    =====================================================
    REGISTER SCENES
    =====================================================
    */
    registerScenes() {
        const sceneManager = window?.App?.SceneManager
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
        console.log("[HomeApp] scenes registered")
    }
}