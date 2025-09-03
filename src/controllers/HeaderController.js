export class HeaderController {
  constructor() {
    this.header = document.querySelector('.header')

    if (!this.header) return

    this.themeBtn = document.querySelector('.header__theme-switch')
    this.langBtn = document.getElementById('lang-switch')

    this.lastScroll = 0

    this.init()
  }

  init() {
    if (!this.header) return

    window.addEventListener('scroll', this.onScroll.bind(this))

    if (this.themeBtn) this.themeBtn.addEventListener('click', this.toggleTheme)
    if (this.langBtn) this.langBtn.addEventListener('click', this.toggleLang)
  }

  onScroll= () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 10) {
      this.header.classList.add('header--scrolled')
    } else {
      this.header.classList.remove('header--scrolled')
    }
  }

  toggleTheme = () => {
    document.body.classList.toggle('theme-dark')
  }

  toggleLang = () => {
    if (this.langBtn.textContent.includes('RU')) {
      this.langBtn.textContent = 'EN'
      document.documentElement.lang = 'en'
    } else {
      this.langBtn.textContent = 'RU'
      document.documentElement.lang = 'ru'
    }
  }
}

// Для инициализации:
// import { HeaderController } from './HeaderController';
// new HeaderController();

