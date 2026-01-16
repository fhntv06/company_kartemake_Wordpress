import { AccordionController } from './AccordionController.js'
import { AnchorController } from './AnchorController.js'
import { AnimationNumbersController } from './AnimationNumbersController.js'
import { BurgerMenuController } from './BurgerMenuController.js'
import { CalculatorController } from './CalculatorController.js'
import { CubeWithWorkItemsController } from './CubeWithWorkItemsController.js'
import { FormController } from './FormController.js'
import { CursorController } from './CursorController.js'
import { HeaderController } from './HeaderController.js'
import { InteractiveCardEffectController } from './InteractiveCardEffectController.js'
import { LangController } from './LangController.js'
import { ModalController } from './ModalController.js'
import { PreloaderController } from './PreloaderController.js'
import { RippleEffectController } from './RippleEffectController.js'
import { SidebarAnchorController } from './SidebarAnchorController.js'
import { SpecialistWidgetController } from './SpecialistWidgetController.js'
import { StarfieldController } from './StarfieldController.js'
import { TabsController } from './TabsController'
import { ThemeController } from './ThemeController.js'

export class EntryPointApp {
  constructor() {
    this.controllerReplaceChar = ' '

    this.controllersExperimental = {
      accordion: AccordionController,
      anchor: AnchorController,
      'animation-numbers': AnimationNumbersController,
      'calculator': CalculatorController,
      'cube-with-work': CubeWithWorkItemsController,
      'form': FormController,
      'custom-cursor': CursorController,
      header: HeaderController,
      'interactive-card-effect': InteractiveCardEffectController,
      lang: LangController,
      modal: ModalController,
      preloader: PreloaderController,
      'ripple-effect': RippleEffectController,
      'sidebar-anchor': SidebarAnchorController,
      'specialist-widget': SpecialistWidgetController,
      starfield: StarfieldController,
      tabs: TabsController,
      theme: ThemeController,
    }

    this.controllersMustExecuted = {
      'burger-menu': BurgerMenuController,
    }

    this.connect()
  }
  connect = () => {
    console.log('Main initialized')

    const controllerContainers = Array.from(document.querySelectorAll(`[data-controller]`))

    controllerContainers.forEach((container) => {
      const controllerAttr = container.dataset.controller // custom-cursor modal

      if (controllerAttr.includes(this.controllerReplaceChar)) {
        controllerAttr.split(this.controllerReplaceChar)
          .forEach((controllerName) => {
            this.initializeEntityController(controllerName, container)
          }
        )
      } else {
        this.initializeEntityController(controllerAttr, container)
      }
    })

    // must controllers
    for (const controllerName in this.controllersMustExecuted) {
      const entityController = this.controllersMustExecuted[controllerName]

      if (!this.controllersMustExecuted[controllerName]) console.error("Is controller ", controllerName, " not define!")
      console.log('Initializing controller:', entityController.name)
      new entityController(controllerName, document.body)
    }
  }
  initializeEntityController = (controllerName, container) => {
    if (!this.controllersExperimental[controllerName]) console.error("Is controller ", controllerName, " not define!")
    else {
      const entityController = this.controllersExperimental[controllerName]

      console.log('Initializing controller:', entityController.name)

      new entityController(controllerName, container)
    }
  }
}