export class InteractiveCardEffectController {
  constructor(controllerName, container) {
    this.items = container.querySelectorAll(`[data-controller-${controllerName}="item"]`)

    this.init()
  }
  init= () => {
    this.items.forEach((card) => {
      card.addEventListener('mousemove', this.eventMouseMoveHandler)

      card.addEventListener('mouseleave', eventMouseLeaveHandler)
    })
  }
  eventMouseMoveHandler = (e) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top

    e.currentTarget.style.transform = `perspective(1000px) rotateX(${-(y - e.currentTarget.offsetHeight/2)/20}deg) rotateY(${(x - e.currentTarget.offsetWidth/2)/20}deg)`
  }
  eventMouseLeaveHandler = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
  }
}