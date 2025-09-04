export class ModalController {
  constructor() {
    // Модальное окно
    this.modals = Array.from(document.querySelectorAll('.modal'))

    if (!this.modals.length) return

    this.init()
  }
  init = () => {
    this.openModalButtons = Array.from(document.querySelectorAll('[data-open-modal]'))
    this.openModalButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        document.getElementById(e.currentTarget.dataset.openModal).classList.add('active')
      })
    })
    this.modals.forEach((modal) => {
      modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active')
      })

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active')
        }
      })
    })
  }
}