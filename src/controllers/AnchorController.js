export class AnchorController {
  constructor(controllerName, container) {
    this.items = Array.from(container.querySelectorAll(`[data-controller-${controllerName}="item"]`))

    if (!this.items.length) {
        throw new Error(`No have controller items in ${controllerName}`)
    }

    this.scrollHintText = document.getElementById('scroll-hint')
    this.duration = 1000 // продолжительность анимации в мс

    this.init()
  }
  init = () => {
    this.items.forEach((link) => link.addEventListener('click', this.anchorHandler))

    const scrollHintText = this.scrollHintText
    if (scrollHintText) {
      window.addEventListener('scroll', function() {
        (window.pageYOffset > 300)
          ? scrollHintText.classList.add('hidden')
          : scrollHintText.classList.remove('hidden')
      })
    }
  }
  anchorHandler = (e) => {
    e.preventDefault()

    const targetId = e.currentTarget.getAttribute('href')

    if (targetId === '#') return

    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      const targetPosition = targetElement.offsetTop

      // Плавная прокрутка к секции
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }
}
