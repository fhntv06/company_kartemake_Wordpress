export class CursorController {
  constructor(controllerName, container) {
    this.item = container.querySelector(`[data-controller-${controllerName}="item"]`)

    if (!this.item) {
      console.error(`[CursorController] - No item found for controller: ${controllerName}`)
      return
    }

    if (window.innerWidth > 768) this.init()
    else this.item.remove()
  }

  init() {
    document.addEventListener('mousemove', (e) => this.setCursorPosition(e))
  }
  setCursorPosition = (e) => {
    this.item.style.left = e.clientX + 'px'
    this.item.style.top = e.clientY + 'px'
  }
}
