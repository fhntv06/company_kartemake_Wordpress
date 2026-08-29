export default class BlogApp {
    constructor() {
        this.modules = {}
        this.registry = {}

        this.init()
    }
    init() {
        if (!window.App) {
            console.warn("[HomeApp] window.App does not exist. GlobalApp may not be initialized.")
            window.App = {}
        }

        for (const [name, Module] of Object.entries(this.registry)) {
            const instance = new Module()
            this.modules[name] = instance
            window.App[name] = instance
        }

        console.log("[BlogApp] initialized")
    }
}
