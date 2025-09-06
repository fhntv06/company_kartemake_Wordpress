export class LangController {
  constructor(controllerName, container) {
    this.item = container.querySelector(`[data-controller-${controllerName}="item"]`)

    this.init()
  }
  init = () => {
    if (!localStorage.getItem('lang')) {
      this.setLang()
    }

    this.item.addEventListener('click', this.setLang)
  }
  getLang = () => {
    return localStorage.getItem('lang') === 'ru' ? 'en' : 'ru'
  }
  setLang = () => {
    const newLang = this.getLang()

    this.item.textContent = newLang
    localStorage.setItem('lang', newLang)
    document.documentElement.lang = newLang
  }
}
