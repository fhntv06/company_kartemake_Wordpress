export class RippleEffectController {
  constructor(controllerName, container) {
    this.items = container.querySelectorAll(`[data-controller-${controllerName}="item"]`)

    this.init()
  }

  init = () => {
    this.items.forEach(btn => btn.addEventListener('click', (e) => this.createRipple(e)))
  }
  createRipple = (e) => {
    let ripple = document.createElement("span")

    ripple.classList.add("ripple")

    e.currentTarget.appendChild(ripple)

    ripple.style.left = `${e.offsetX}px`
    ripple.style.top = `${e.offsetY}px`

    ripple.addEventListener('animationend', () => ripple.remove())
  }
}
