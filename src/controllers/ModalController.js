export class ModalController {
  constructor(controllerName, container) {
    this.container = container
    this.modal = null
    this.closeBtn = this.container.querySelector('.close-modal')
    this.openModalButtons = Array.from(document.querySelectorAll(`[data-controller-${controllerName}-func="open"]`))

    this.init()
  }
  init = () => {
    if (this.openModalButtons.length) {
      this.openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          this.modal = document.getElementById(e.currentTarget.dataset.controllerModalOpen)

          if (this.modal) {
            this.modal.addEventListener('click', this.hideModal)
            this.modal.classList.add('active')
          } else console.error(`Don't element with attribute data-controller-modal-open="${e.currentTarget.dataset.controllerModalOpen}" in `, this.container)
        })
      })
    } else console.error(`Don't element with attribute data-controller-modal-func="open" in `, this.container)

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.container.classList.remove('active')
      })
    } else console.error(`Don't element with class="close-modal" in `, this.container)
  }
  hideModal = (e) => {
    if (e.target === this.modal) {
      this.modal.classList.remove('active')
    }
  }
}
