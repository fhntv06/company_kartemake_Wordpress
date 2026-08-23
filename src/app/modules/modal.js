export default class ModalController {
  constructor() {
    console.log("[ModalController] ready")
    this.modal = document.getElementById('modal')

    if (!this.modal) {
      console.warn("[ModalController] Modal not found");
    }

    this.openElements = Array.from(document.querySelectorAll('[data-modal-func="open"]'))

    if (!this.openElements.length) {
      console.warn("[ModalController] Buttons not found");
    }

    this.closeElement = Array.from(document.querySelectorAll('[data-modal-func="close"]'))

    if (!this.closeElement) {
      console.warn("[ModalController] Close element not found");
    }

    this.config = {
      classActive: 'active'
    }

    this.init()
  }

  init() {
    this.bindEvents()
  }
  bindEvents() {
    this.openElements.forEach((button) => {
      button.addEventListener('click', () => this.handlerOpen())
    })
    this.closeElement.forEach((button) => {
      button.addEventListener('click', () => this.handlerClose())
    })
  }
  handlerOpen() {
    this.modal.classList.add(this.config.classActive)
  }
  handlerClose() {
    this.modal.classList.remove(this.config.classActive)
  }
}