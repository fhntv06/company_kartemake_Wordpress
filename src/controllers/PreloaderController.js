export class PreloaderController {
  constructor() {
    this.preloader = document.querySelector('.preloader')
    this.body = document.body

    if (!this.preloader) return

    this.init()
  }

  init = () => {
    if (!this.preloader) return
    this.lockScroll()
    window.addEventListener('DOMContentLoaded', this.onLoad)
  }

  lockScroll = () => {
    this.body.classList.add('preloader-lock')
  }

  unlockScroll = () => {
    this.body.classList.remove('preloader-lock')
  }

  onLoad = () => {
    // Запуск анимации SVG
    const timer = setTimeout(() => {
      const timerInner = setTimeout(() => {
        this.exitPreloaderAnimation()

        clearTimeout(timerInner)
      }, 700)

      clearTimeout(timer)
    }, 2000) // после завершения dash
  }
  exitPreloaderAnimation= () => {
    this.hidePreloader()
    Array.from(document.querySelectorAll('header , main, footer')).forEach(el => el.style.opacity = '1')
  }
  hidePreloader = () => {
    this.preloader.classList.add('preloader--hidden')

    const timer = setTimeout(() => {
      this.preloader.remove()
      this.unlockScroll()

      clearTimeout(timer)
    }, 1000) // время transition
  }
}