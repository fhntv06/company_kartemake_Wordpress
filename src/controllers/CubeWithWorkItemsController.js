export class CubeWithWorkItemsController {
  constructor(controllerName, container) {
    // Интерактивность для карточек работ
    this.items = container.querySelectorAll(`[data-controller-${controllerName}="item"]`)

    this.worksCube = container.querySelector('.works-cube')
    this.worksVisual = container.querySelector('.works-visual')

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