export class SidebarAnchorController {
  constructor(controllerName, container) {
    this.sidebar = container;

    if (!this.sidebar) {
      throw new Error(`No have sidebar in ${controllerName}`)
    }

    this.items = Array.from(this.sidebar.querySelectorAll(`[data-controller-${controllerName}="item"]`));

    if (!this.items.length) {
      throw new Error(`No have controller items in ${controllerName}`)
    }

    this.classActive = 'active'

    this.init()
  }
  init = () => {
    // Плавная прокрутка при клике на ссылки в sidebar
    this.items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        item.classList.add(this.classActive)

        document.dispatchEvent(new CustomEvent('close-burger'))
      })
    })
  }
}