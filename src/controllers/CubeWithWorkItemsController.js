export class CubeWithWorkItemsController {
  constructor(controllerName, container) {
    // Интерактивность для карточек работ
    this.items = container.querySelectorAll(`[data-controller-${controllerName}="item"]`)

    if (!this.items.length) {
      throw new Error(`Don't have items in controller: ${controllerName}`)
    }

    this.worksCube = container.querySelector('.works-cube')
    this.worksVisual = container.querySelector('.works-visual')

    if (!this.worksCube) {
      throw new Error(`Don't have worksCube element in controller: ${controllerName}`)
    }
    if (!this.worksVisual) {
      throw new Error(`Don't have worksVisual element in controller: ${controllerName}`)
    }

    this.init()
  }
  init = () => {
    this.items.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        this.worksVisual.style.opacity = '1'
        this.worksCube.style.transform = `rotateX(${-15 + index * 10}deg) rotateY(${30 + index * 30}deg)`;
      })
      card.addEventListener('mouseleave', () => {
        this.worksVisual.style.opacity = ''
        this.worksCube.style.transform = '';
      })
    })
  }
}