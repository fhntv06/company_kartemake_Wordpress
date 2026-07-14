export class BurgerMenuController {
    constructor(controllerName, container) {
      this.items = Array.from(container.querySelectorAll(`[data-controller-${controllerName}="item"]`))

    if (!this.items.length) {
      throw new Error(`No have controller items in ${controllerName}`)
    }

    this.classActive = 'active'
    this.classOpen = 'open'
    // this.activeButton = null

    this.sidebar = document.getElementById('sidebar-burger-menu');
    this.overlay = document.getElementById('overlay');

    this.init()
  }
  init = () => {
    this.items.forEach((button) => button.addEventListener('click', this.openMenu))
    this.overlay.addEventListener('click', this.closeMenu);
  }
  openMenu = (e) => {
    // const button = e.target

    // this.activeButton = button

    this.sidebar.classList.toggle(this.classOpen)
    this.overlay.classList.toggle(this.classActive)
    // button.classList.toggle(this.classActive)

    // Блокировка скролла при открытом sidebar
    document.body.style.overflow = this.sidebar.classList.contains('open')
      ? 'hidden' :
      ''
  }
  closeMenu = (e) => {
    this.items.forEach(button => button.classList.remove(this.classActive))

    this.sidebar.classList.remove('open');
    e.target.classList.remove('active');
    // this.activeButton.classList.remove('active');
    document.body.style.overflow = '';
  }
}