export class AnimationNumbersController {
  constructor(controllerName, container) {
    this.animateValues = Array.from(container.querySelectorAll(`[data-controller-${controllerName}="item"]`))

    this.init()
  }
  init = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateValue({ element: entry.target, start: 0, end: Number(entry.target.textContent), duration: 1000 })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    this.animateValues.forEach((el) => {
      observer.observe(el)
    })
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
        prefix + ' '
        + this.formatPrice(Math.floor(progress * (settings.end - settings.start) + settings.start))
        + ' ' + postfix

      if (progress < 1) window.requestAnimationFrame(nextStep)
    }

    window.requestAnimationFrame(nextStep)
  }
  formatPrice = (price) =>  {
    return parseInt(price).toLocaleString('ru-RU')
  }
}
