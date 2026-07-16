export class ModalController {
  constructor(controllerName, container) {
    this.container = container
    this.controllerName = controllerName

    if (!this.container) {
      throw Error(`Don't container for controller: ${this.controllerName}`, );
    }

    this.openModalButtons = Array.from(this.container.querySelectorAll(`[data-controller-${controllerName}-func="open"]`))
    this.closeModalButtons = Array.from(this.container.querySelectorAll(`[data-controller-${controllerName}-func="close"]`))

    if (!this.openModalButtons.length) {
      throw Error(`Don't element for open modal with attribute data-controller-modal-func="open" in ${this.container}`, );
    }
    if (!this.closeModalButtons.length) {
      throw Error(`Don't element for open modal with attribute data-controller-modal-func="close" in ${this.container}`);
    }

    this.modal = null

    this.init()
  }
  init = () => {
    this.openModalButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.modal = document.getElementById(e.currentTarget.dataset.controllerModalOpen)

        this.closeModalButtons.forEach((button) => {
            button.addEventListener('click', () => {
              this.modal.classList.remove('active')
              document.body.style.overflow = ''
            })
          }
        )

        if (this.modal) {
          this.modal.addEventListener('click', this.hideModal)
          this.modal.classList.add('active')
          // Блокировка скролла при открытой modal
          document.body.style.overflow = 'hidden'
        }
      })
    })
  }
  hideModal = (e) => {
    if (e.target === this.modal) {
      this.modal.classList.remove('active')
      document.body.style.overflow = ''
    }
  }
}
