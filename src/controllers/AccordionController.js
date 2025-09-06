export class AccordionController {
  constructor(controllerName, container) {
    this.items = container.querySelectorAll(`[data-controller-${controllerName}="item"]`)

    this.init()
  }
  init = () => {
    this.items.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('active')
      })
    })
  }
}