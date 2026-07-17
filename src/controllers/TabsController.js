export class TabsController {
  constructor(controllerName, container) {
    this.container = container
    this.navigationBtns = Array.from(document.querySelectorAll(`[data-controller-${controllerName}-func="open"]`))
    this.panels = Array.from(this.container.querySelectorAll(`[data-controller-${controllerName}="item"]`))

    this.elementFuncs = Array.from(this.container.querySelectorAll(`[data-controller-${controllerName}-func]`))

    this.init()
    this.setupFuncs()
  }
  init = () => {
    this.navigationBtns.forEach((button) => {
      button.addEventListener('click', () => {
        this.clearActiveNavigationBtns()

        const panelId = button.dataset.panel

        if (!panelId) {
          console.error(`Don't attribute or empty data-panel on this navigation button" in `, this.container)
          return
        }

        const panel = this.container.querySelector(`#${panelId}`)

        if (panel) {
          button.classList.add('active')
          panel.classList.add('active')
        } else console.error(`Don't element panel tabs with attribute data-panel="${panelId}" in `, this.container)
      })
    })
  }
  clearActiveNavigationBtns = () => {
    this.navigationBtns.forEach(b => b.classList.remove('active'))
    this.panels.forEach(p => p.classList.remove('active'))
  }
  setupFuncs = () => {
    this.elementFuncs.forEach((element) => element.addEventListener('click', this[element.dataset.controllerTabsFunc]))
  }
  setTariffsInForm = (e) => {
    document.dispatchEvent(
      new CustomEvent('fill-form-field',
        {
          detail: {
            fieldName: 'message',
            value: `Здравствуйте, я выбрал тариф "${e.target.dataset.tariffName || "Бизнес"}" стоимостью ${e.target.dataset.tariffPrice || 'от&nbsp;25 000&nbsp;₽'}` }
        }
      ));
  }
}