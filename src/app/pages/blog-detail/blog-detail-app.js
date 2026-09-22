/*
=====================================================
K·ART·MAKE V5.2

BLOG DETAIL APP

*/

import Sidebar from "../../modules/global/sidebar";

export default class BlogDetailApp {
    constructor() {
        this.modules = {}
        /*
        =====================================================
        HOME MODULE REGISTRY
        =====================================================
        */
        this.registry = {
            Sidebar
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
            console.warn("[BlogDetailApp] window.App does not exist. GlobalApp may not be initialized.")
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
        console.log("[BlogDetailApp] initialized")
    }
}
