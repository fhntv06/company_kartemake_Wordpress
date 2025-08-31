import { PreloaderController } from './PreloaderController.js'

export class EntryPointApp {
  constructor() {
    this.controllers = [
      PreloaderController
    ]

    this.init()
  }
  init = () => {
    console.log('Main initialized')

    this.controllers.forEach(controller => {
      console.log('Initializing controller:', controller.name)
      new controller()
    })
  }
}