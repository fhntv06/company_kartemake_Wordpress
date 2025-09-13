export class AnchorController {
  constructor(controllerName, container) {
    this.items = Array.from(container.querySelectorAll(`[data-controller-${controllerName}="item"]`))

    this.duration = 1000 // продолжительность анимации в мс

    this.init()
    this.initBackButton()
  }
  init = () => {
    this.items.forEach((link) => link.addEventListener('click', this.anchorHandler))
  }
  initBackButton = () => {
    const backToTopButton = document.querySelector('.to-top');
    const scrollHintText = document.querySelector('.scroll-hint');

    backToTopButton.addEventListener('click', this.anchorHandler)

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible')
        scrollHintText.classList.add('hidden')
      } else {
        backToTopButton.classList.remove('visible')
        scrollHintText.classList.remove('hidden')
      }
    })
  }
  anchorHandler = (e) => {
    e.preventDefault()

    const targetId = e.currentTarget.getAttribute('href')
    let targetScroll = 0
    let currentScroll = 0

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
