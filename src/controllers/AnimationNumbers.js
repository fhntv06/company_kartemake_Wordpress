export class AnimationNumbers {
  constructor() {
    this.animateValues = Array.from(document.querySelectorAll('.animate-value'))

    this.init()
  }
  init = () => {
    this.animateValues.forEach((el) => this.animateValue({ element: el, start: 0, end: Number(el.textContent), duration: 1000}))
  }
  animateValue = (settings) => {
    if (typeof settings.start != "number" || typeof settings.end != "number" || typeof settings.duration != "number") {
      return console.log("Error types in Animation value with settings:", settings)
    }

    let startTimestamp = null

    const nextStep = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp

      const progress = Math.min((timestamp - startTimestamp) / settings.duration, 1)
      const { prefix = '', postfix = '' } = settings.element.dataset

      settings.element.innerHTML =
        prefix
        + Math.floor(progress * (settings.end - settings.start) + settings.start)
        + postfix

      if (progress < 1) window.requestAnimationFrame(nextStep)
    }

    window.requestAnimationFrame(nextStep)
  }
}
