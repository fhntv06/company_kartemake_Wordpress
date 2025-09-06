export class ThemeController {
  constructor(controllerName, container) {
    this.themeToggleButton = container.querySelector(`[data-controller-${controllerName}="item"]`)

    this.init()
  }
  init = () => {
    this.setTheme()

    const eventThemeToggle = new Event('themeToggle')

    this.themeToggleButton.addEventListener('click', () => {
      const newTheme = this.getTheme() === 'light' ? 'dark' : 'light'

      this.setTheme(newTheme)

      window.dispatchEvent(eventThemeToggle)
    })
  }
  getTheme = () => {
    return localStorage.getItem('theme') || 'light'
  }
  setTheme = (newTheme = '') => {
    const theme = !newTheme ? this.getTheme() : newTheme

    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }
}