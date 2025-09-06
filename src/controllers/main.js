import { AccordionController } from './AccordionController.js'
import { AnimationNumbers } from './AnimationNumbers.js'
import { CubeWithWorkItemsController } from './CubeWithWorkItemsController.js'
import { CursorController } from './CursorController.js'
import { HeaderController } from './HeaderController.js'
import { LangController } from './LangController.js'
import { ModalController } from './ModalController.js'
import { PreloaderController } from './PreloaderController.js'
import { RippleEffectController } from './RippleEffectController.js'
import { StarfieldController } from './StarfieldController.js'
import { TabsController } from './TabsController'
import { ThemeController } from './ThemeController.js'

export class EntryPointApp {
  constructor() {
    this.controllerReplaceChar = ' '

    this.controllersExperimental = {
      accordion: AccordionController,
      'animation-numbers': AnimationNumbers,
      'cube-with-work': CubeWithWorkItemsController,
      'custom-cursor': CursorController,
      header: HeaderController,
      lang: LangController,
      modal: ModalController,
      preloader: PreloaderController,
      'ripple-effect': RippleEffectController,
      starfield: StarfieldController,
      tabs: TabsController,
      theme: ThemeController,
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