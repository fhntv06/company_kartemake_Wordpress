import { AccordionController } from './AccordionController.js'
import { AnchorController } from './AnchorController.js'
import { AnimationNumbersController } from './AnimationNumbersController.js'
import { BlobClusterController  } from './BlobClusterController.js'
import { BurgerMenuController } from './BurgerMenuController.js'
import { CalculatorController } from './CalculatorController.js'
import { CubeWithWorkItemsController } from './CubeWithWorkItemsController.js'
import { FormController } from './FormController.js'
import { CursorController } from './CursorController.js'
import { HeaderController } from './HeaderController.js'
import { InteractiveCardEffectController } from './InteractiveCardEffectController.js'
import { LangController } from './LangController.js'
import { ModalController } from './ModalController.js'
import { PhysicsContainerController } from './PhysicsContainerController.js'
import { PreloaderController } from './PreloaderController.js'
import { RippleEffectController } from './RippleEffectController.js'
import { ScrollProgressController } from './ScrollProgressController.js'
import { SidebarAnchorController } from './SidebarAnchorController.js'
import { SpecialistWidgetController } from './SpecialistWidgetController.js'
import { StarfieldController } from './StarfieldController.js'
import { TabsController } from './TabsController'
import { ThemeController } from './ThemeController.js'

export class EntryPointApp {
  constructor() {
    this.controllerBeforeLoad = {
      starfield: StarfieldController,
      preloader: PreloaderController,
    }
    this.controllers = {
      accordion: AccordionController,
      anchor: AnchorController,
      'animation-numbers': AnimationNumbersController,
      'blob-cluster': BlobClusterController,
      'burger-menu': BurgerMenuController,
      'calculator': CalculatorController,
      'cube-with-work': CubeWithWorkItemsController,
      'form': FormController,
      'custom-cursor': CursorController,
      header: HeaderController,
      'interactive-card-effect': InteractiveCardEffectController,
      lang: LangController,
      modal: ModalController,
      'physics-container': PhysicsContainerController,
      'ripple-effect': RippleEffectController,
      'scroll-progress': ScrollProgressController,
      'sidebar-anchor': SidebarAnchorController,
      'specialist-widget': SpecialistWidgetController,
      tabs: TabsController,
      theme: ThemeController,
    }

    this.connect()
  }
  connect = () => {
    document.addEventListener('exit-preloader', this.loadControllers)
    this.beforeLoadControllers()
    // this.loadControllers()
  }
  beforeLoadControllers = () => {
    try {
      for (const controllerName in this.controllerBeforeLoad) {
        const entityController = this.controllerBeforeLoad[controllerName]

        if (!entityController) console.error("Is controller ", controllerName, " not define!")
        console.log('Initializing controller:', entityController.name)
        new entityController(controllerName, document.body)
      }

      console.log('Before load controllers initialized!')
    } catch (e) {
      console.error(`Before load controllers failed! Error: ${e}`)
    }
  }
  loadControllers = () => {
    try {
      for (const controllerName in this.controllers) {
        const controllerContainers = Array.from(document.querySelectorAll(`[data-controller~="${controllerName}"]`))

        controllerContainers.forEach((container) => {
          this.initializeEntityController(controllerName, container)
        })
      }

      console.log('Main controllers initialized!')
    } catch (e) {
      console.error(`Main controllers failed! Error: ${e}`)
    }
  }
  initializeEntityController = (controllerName, container) => {
    const entityController = this.controllers[controllerName]

    try {
      new entityController(controllerName, container)
      console.log('Initializing controller is success:', entityController.name)
    } catch (e) {
      console.error('Initializing controller is failed:', entityController.name)
      console.error(`Error init ${entityController.name}:`, e)
    }
  }
}