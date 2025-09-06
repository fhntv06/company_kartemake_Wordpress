export class HeaderController {
  constructor(controllerName, container) {
    this.container = container

    this.init()
  }
  init() {
    window.addEventListener('scroll', this.onScroll)
  }
  onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 10) {
      this.container.classList.add('header--scrolled')
    } else {
      this.container.classList.remove('header--scrolled')
    }
  }
}
