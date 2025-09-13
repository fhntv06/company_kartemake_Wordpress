export class PreloaderController {
  constructor(controllerName, container) {
    this.container = container
    this.preloader = container.querySelector(`[data-controller-${controllerName}="item"]`)

    if (!this.preloader) {
      console.error(`Don't preloader with attribute data-controller-${controllerName}="item" in `, this.container)
      return
    }

    this.init()
  }
  init = () => {
    this.lockScroll()
    window.addEventListener('DOMContentLoaded', this.onLoad)
  }
  lockScroll = () => {
    document.body.classList.add('preloader-lock')
  }
  unlockScroll = () => {
    document.body.classList.remove('preloader-lock')
  }
  onLoad = () => {
    const timer = setTimeout(() => {
      const timerInner = setTimeout(() => {
        this.exitPreloaderAnimation()

        clearTimeout(timerInner)
      }, 700)

      clearTimeout(timer)
    }, 2000) // после завершения dash
  }
  exitPreloaderAnimation = () => {
    this.hidePreloader()
    Array.from(document.querySelectorAll('header , main, footer'))
      .forEach((el) => el.style.opacity = '1')
  }
  hidePreloader = () => {
    this.preloader.classList.add('preloader--hidden')

    this.preloader.addEventListener('transitionend', () => {
      this.preloader.remove()
      this.unlockScroll()
    })
  }
}