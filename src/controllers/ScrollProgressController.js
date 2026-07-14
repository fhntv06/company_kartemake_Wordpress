// ScrollProgressController.js
export class ScrollProgressController {
  constructor(controllerName, container) {
    this.container = container
    this.progressElement = this.container.querySelector(`[data-controller-${controllerName}="item"]`)

    if (!this.progressElement) {
      throw new Error(`${controllerName}: Element with data-controller-${controllerName}="item" not found in container ${container}`)
    }

    this.init()
  }

  init() {


    // Добавляем обработчик скролла
    this.handleScroll = this.handleScroll.bind(this)
    window.addEventListener('scroll', this.handleScroll, { passive: true })

    // Инициализируем начальное состояние
    this.updateProgress()
  }

  handleScroll() {
    this.updateProgress()
  }

  updateProgress() {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight

    if (docHeight <= 0) {
      this.progressElement.style.width = '0%'
      return
    }

    const progress = (scrollTop / docHeight) * 100
    this.progressElement.style.width = `${Math.min(progress, 100)}%`
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}