import CanvasEngine from "./core/canvas-engine.js"
import ScrollEngine from "./core/scroll-engine.js"
import SceneManager from "./core/scene-manager.js"

import ArchitectureBuilder from "./modules/architecture-builder.js"
import AuditEngine from "./modules/audit-engine.js"
import DashboardMenu from "./modules/dashboard-menu.js"
import Terminal from "./modules/terminal.js"
import MonitoringScroll from "./modules/monitoring-scroll.js"
import TransitionLoader from "./modules/transition-loader.js"
import AnchorNavigation from "./modules/anchor-navigation.js"
// import SceneTransition from "./modules/scene-transition.js"
import OrbitNavigation from "./modules/orbit-navigation.js"
import PipelineScroll from "./modules/pipeline-scroll.js"
import SolutionsEngine from "./modules/solutions-engine.js"
import SceneRegistry from "./modules/scene-registry.js"
import ContactScroll from "./modules/contact-scroll.js"
import HeroParticleAssembly from "./modules/hero-particle-assembly.js"
import CookieController from "./modules/cookie-controller.js"
import ModalController from './modules/modal.js'

/*
=====================================================
K·ART·MAKE V5.2

MAIN APPLICATION BOOT

=====================================================
*/
export default class EntryPointApp {
  constructor() {
    this.modules = {}
    this.boot()
  }

  boot() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initialize()
    })

    this.registryModules = [
      CanvasEngine, ScrollEngine, SceneManager,
      TransitionLoader, OrbitNavigation, AuditEngine,
      DashboardMenu, MonitoringScroll, AnchorNavigation,
      ContactScroll, HeroParticleAssembly, CookieController,
      ModalController, SolutionsEngine, ArchitectureBuilder,
      PipelineScroll, Terminal
    ]
    this.beforeLoad = [SceneRegistry]
  }

  initialize() {
    console.log("%cK·ART·MAKE SYSTEM ONLINE", "color:#ff6b00font-size:16px")

    /*
    ========================================================
    SCENE MANAGER MUST EXIST BEFORE SCENE ENGINES
    ========================================================
    */
    this.initRegistry()
    this.hideLoader()
  }
  initRegistry() {
    [...this.registryModules, ...this.beforeLoad].forEach((module) => {
      const instance = new module()
      const name = instance.constructor.name

      this.modules[name] = instance
      window[name] = instance
      
      if (name === SceneRegistry) {
        instance.debug()
      }
    })

    this.modules.SceneManager.register("audit", this.modules.AuditEngine)
    this.modules.SceneManager.register("solutions", this.modules.SolutionsEngine)
    this.modules.SceneManager.register("architecture", this.modules.ArchitectureBuilder)
    this.modules.SceneManager.register("pipeline", this.modules.PipelineScroll)
    this.modules.SceneManager.register("monitoring", this.modules.MonitoringScroll)
    this.modules.SceneManager.register("contact", this.modules.ContactScroll)
  }

  startExperience() {
    this.modules.SceneManager.start()
    ScrollTrigger.refresh()

    document.body.classList.add('document-ready')
  }

  /*
  =====================================================
  LOADER
  =====================================================
  */
  hideLoader() {
    const loader = document.querySelector(".system-loader")
    if (!loader) {
      this.startExperience()
      return
    }
    setTimeout(() => {
      loader.style.opacity = "0"
      setTimeout(() => {
        loader.remove()
        this.startExperience()
      }, 1000)
    }, 2200)
  }
}
