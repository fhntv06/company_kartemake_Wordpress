export class ModalController {
  constructor() {
    // Видео модальное окно
    this.showreel = document.getElementById('showreel')
    this.videoModal = document.getElementById('video-modal')
    this.closeModal = document.querySelector('.close-modal')

    this.init()
  }
  init = () => {
    this.showreel.addEventListener('click', () => {
      this.videoModal.classList.add('active')
    })
    this.closeModal.addEventListener('click', () => {
      this.videoModal.classList.remove('active')
    })
    this.videoModal.addEventListener('click', (e) => {
      if (e.target === this.videoModal) {
        this.videoModal.classList.remove('active')
      }
    })
  }
}