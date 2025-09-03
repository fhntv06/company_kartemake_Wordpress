export class CubeWithWorkItemsController {
  constructor() {
    // Интерактивность для карточек работ
    this.container = document.getElementById('last-works')
    this.workCards = this.container.querySelectorAll('.work-item')
    this.worksCube = this.container.querySelector('.works-cube')
    this.worksVisual = this.container.querySelector('.works-visual')

    this.init()
  }
  init = () => {
    this.workCards.forEach((card, index) => {
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