export default class BaseApp {
    constructor(registry, name = 'App') {
        this.name = name
        this.registry = registry
        this.modules = {}

        // Общая логика — инициализация window.App
        if (!window.App) {
            console.warn(`[${name}] window.App does not exist. GlobalApp may not be initialized.`)
            window.App = {}
        }

        // Общая логика — создание инстансов
        for (const [key, Module] of Object.entries(this.registry)) {
            const instance = new Module()
            this.modules[key] = instance
            window.App[key] = instance
        }

        // Хук для наследников — они могут что-то сделать после инициализации
        this.onInit?.()
        console.log(`[${name}] initialized`)
    }
}
