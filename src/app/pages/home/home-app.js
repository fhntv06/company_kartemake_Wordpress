import ArchitectureBuilder from "../../modules/home/architecture-builder.js"
import AuditEngine from "../../modules/home/audit-engine.js"
import Terminal from "../../modules/home/terminal.js"
import PipelineScroll from "../../modules/home/pipeline-scroll.js"
import SolutionsEngine from "../../modules/home/solutions-engine.js"
import SceneRegistry from "../../modules/home/scene-registry.js"

import HeroParticleAssembly from "../../modules/global/hero-particle-assembly.js"
import OrbitNavigation from "../../modules/global/orbit-navigation.js"

import BaseApp from "../../core/base-app";

export default class HomeApp extends BaseApp {
    constructor() {
        super({
            HeroParticleAssembly,
            OrbitNavigation,
            ArchitectureBuilder,
            AuditEngine,
            Terminal,
            PipelineScroll,
            SolutionsEngine,
            SceneRegistry
        }, 'HomeApp')
    }

    onInit() {
        this.registerScenes()
    }

    registerScenes() {
        const sceneManager = window?.App?.SceneManager
        if (!sceneManager) {
            console.warn("[HomeApp] SceneManager not found")
            return
        }
        sceneManager.register("audit", this.modules.AuditEngine)
        sceneManager.register("solutions", this.modules.SolutionsEngine)
        sceneManager.register("architecture", this.modules.ArchitectureBuilder)
        sceneManager.register("pipeline", this.modules.PipelineScroll)
        console.log("[HomeApp] scenes registered")
    }
}
