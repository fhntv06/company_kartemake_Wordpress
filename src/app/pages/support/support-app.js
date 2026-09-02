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
- HeroParticleAssembly

=====================================================
*/


export default class SupportApp {
    constructor() {
        this.modules = {}
        /*
        =====================================================
        HOME MODULE REGISTRY
        =====================================================
        */
        this.registry = {}
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
            console.warn("[SupportApp] window.App does not exist. GlobalApp may not be initialized.")
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
        console.log("[SupportApp] initialized")
    }
}
