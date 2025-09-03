import { AccordionController } from './AccordionController.js'
import { AnimationNumbers } from './AnimationNumbers.js'
import { CubeWithWorkItemsController } from './CubeWithWorkItemsController.js'
import { CursorController } from './CursorController.js'
import { HeaderController } from './HeaderController.js'
import { ModalController } from './ModalController.js'
import { PreloaderController } from './PreloaderController.js'
import { RippleEffectController } from './RippleEffectController.js'
import { StarfieldController } from './StarfieldController.js'
import { ThemeController } from './ThemeController.js'

export class EntryPointApp {
  constructor() {
    this.controllers = [
      AccordionController,
      AnimationNumbers,
      CubeWithWorkItemsController,
      CursorController,
      HeaderController,
      ModalController,
      PreloaderController,
      RippleEffectController,
      StarfieldController,
      ThemeController,
    ]

    this.init()
  }
  init = () => {
    console.log('Main initialized')

    this.controllers.forEach(controller => {
      if (!controller) console.error("Is controller ", controller, " not define!")
      else {
        console.log('Initializing controller:', controller.name)
        new controller()
      }
    })
  }
}