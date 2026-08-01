import { AccordionController } from './AccordionController.js'
import { AnchorController } from './AnchorController.js'
import { AnimationNumbersController } from './AnimationNumbersController.js'
import { BlobClusterController } from './BlobClusterController.js'
import { BurgerMenuController } from './BurgerMenuController.js'
import { CalculatorController } from './CalculatorController.js'
import { CookieController } from './CookieController.js'
import { CubeWithWorkItemsController } from './CubeWithWorkItemsController.js'
import { FormController } from './FormController.js'
import { HeaderController } from './HeaderController.js'
import { InteractiveCardEffectController } from './InteractiveCardEffectController.js'
import { LangController } from './LangController.js'
import { ModalController } from './ModalController.js'
import { PhysicsContainerController } from './PhysicsContainerController.js'
import { RippleEffectController } from './RippleEffectController.js'
import { ScrollProgressController } from './ScrollProgressController.js'
import { SidebarAnchorController } from './SidebarAnchorController.js'
import { SpecialistWidgetController } from './SpecialistWidgetController.js'
import { TabsController } from './TabsController'
import { ThemeController } from './ThemeController.js'
import { ScrollRevealController } from './ScrollRevealController.js'

export class EntryPointApp {
  constructor() {
    // 1. Прелоадер - единственный контроллер, который запускается ДО всех
    this.controllers = {
      accordion: AccordionController,
      anchor: AnchorController,
      'animation-numbers': AnimationNumbersController,
      'blob-cluster': BlobClusterController,
      'burger-menu': BurgerMenuController,
      'calculator': CalculatorController,
      'cookie': CookieController,
      'cube-with-work': CubeWithWorkItemsController,
      'form': FormController,
      header: HeaderController,
      'interactive-card-effect': InteractiveCardEffectController,
      lang: LangController,
      modal: ModalController,
      'physics-container': PhysicsContainerController,
      'ripple-effect': RippleEffectController,
      'scroll-progress': ScrollProgressController,
      'scroll-reveal': ScrollRevealController,
      'sidebar-anchor': SidebarAnchorController,
      'specialist-widget': SpecialistWidgetController,
      tabs: TabsController,
      theme: ThemeController,
    }

    // 3. Флаг готовности
    this.isInitialized = false

    // 4. Запуск
    this.init()
  }

  // ===== ИНИЦИАЛИЗАЦИЯ =====
  init() {
    console.log('[App] Starting...')

    this.initControllers()

    setTimeout(() => {
      if (!this.isInitialized) {
        console.warn('[App] Force init after timeout')
        this.forceInit()
      }
    }, 3000)
  }

  // ===== ЗАПУСК ВСЕХ КОНТРОЛЛЕРОВ =====
  initControllers() {
    console.log('[App] Initializing controllers (parallel)...')

    // Используем requestIdleCallback для приоритизации
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.initAllControllers()
      }, { timeout: 100 })
    } else {
      // Fallback для старых браузеров
      setTimeout(() => this.initAllControllers(), 0)
    }
  }

  initAllControllers() {
    console.time('[App] Controllers initialization')

    const controllerNames = Object.keys(this.controllers)
    let index = 0

    const initNext = () => {
      if (index >= controllerNames.length) {
        console.timeEnd('[App] Controllers initialization')
        console.log(`[App] All ${controllerNames.length} controllers initialized!`)
        this.isInitialized = true

        // Диспатчим событие готовности приложения
        document.dispatchEvent(new CustomEvent('app:ready'))
        return
      }

      const name = controllerNames[index]
      this.initControllerByName(name)

      index++

      // Каждые 5 контроллеров даем браузеру отдохнуть
      if (index % 5 === 0 && index < controllerNames.length) {
        requestAnimationFrame(initNext)
      } else {
        setTimeout(initNext, 0)
      }
    }

    initNext()
  }

  initControllerByName(name) {
    const containers = document.querySelectorAll(`[data-controller~="${name}"]`)

    if (containers.length === 0) return

    const Controller = this.controllers[name]

    containers.forEach(container => {
      try {
        new Controller(name, container)
        // console.log(`[App] ✓ ${name} initialized`)
      } catch (error) {
        console.error(`[App] ✗ ${name} failed:`, error)
      }
    })
  }

  // ===== ФОРСИРОВАННАЯ ИНИЦИАЛИЗАЦИЯ (если прелоадер сломался) =====
  forceInit() {
    if (this.isInitialized) return

    console.warn('[App] Force initialization')

    // Принудительно показываем контент
    document.querySelectorAll('header, main, footer, section')
        .forEach(el => {
          el.style.opacity = '1'
        })

    // Разблокируем скролл
    document.body.classList.remove('preloader-lock')
    document.body.style.overflow = ''

    // Инициализируем контроллеры, если не сделали это раньше
    if (!this.isInitialized) {
      this.initAllControllers()
    }
  }
}