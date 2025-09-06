export class CursorController {
  constructor(controllerName, container) {
    this.items = container.querySelectorAll(`[data-controller-${controllerName}="item"]`)

    if (window.innerWidth > 768) this.init()
  }

  init() {
    this.items.forEach((item) => {
      document.addEventListener('mousemove', (e) => this.setCursorPosition(e, item))
    })
  }
  setCursorPosition = (e, item) => {
    item.style.left = e.clientX + 'px'
    item.style.top = e.clientY + 'px'
  }
}
