export class RippleEffectController {
  constructor() {
    this.btns = Array.from(document.querySelectorAll(".button, button"))

    if (!this.btns.length) return

    this.init()
  }

  init = () => {
    this.btns.forEach(btn => btn.addEventListener('click', (e) => this.createRipple(e)))
  }
  createRipple = (e) => {
    // Create span element
    let ripple = document.createElement("span")

    // Add ripple class to span
    ripple.classList.add("ripple")

    // Add span to the button
    e.currentTarget.appendChild(ripple)

    // Position the span element
    ripple.style.left = `${e.offsetX}px`
    ripple.style.top = `${e.offsetY}px`

    ripple.addEventListener('animationend', () => ripple.remove())
  }
}
