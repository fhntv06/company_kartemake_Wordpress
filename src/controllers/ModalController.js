export class ModalController {
  constructor(controllerName, container) {
    this.container = container
    this.modal = null
    this.closeBtn = this.container.querySelector('.close-modal')
    this.openModalButtons = Array.from(document.querySelectorAll(`[data-controller-${controllerName}-func="open"]`))

    if (!this.openModalButtons.length) {
      console.error(`Don't element for open modal with attribute data-controller-modal-func="open" in `, this.container)
    } else if (!this.closeBtn) {
      console.error(`Don't element with class="close-modal" in `, this.container)
    } else {
      this.init()
    }
  }
  init = () => {
    this.openModalButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.modal = document.getElementById(e.currentTarget.dataset.controllerModalOpen)

        if (this.modal) {
          this.modal.addEventListener('click', this.hideModal)
          this.modal.classList.add('active')
        } else console.error(`Don't element with attribute data-controller-modal-open="${e.currentTarget.dataset.controllerModalOpen}" in `, this.container)
      })
    })
    this.closeBtn.addEventListener('click', () => {
      this.modal.classList.remove('active')
    })
  }
  hideModal = (e) => {
    if (e.target === this.modal) {
      this.modal.classList.remove('active')
    }
  }
}
