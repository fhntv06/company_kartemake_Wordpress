export class ThemeController {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light'
    this.themeToggleButton = document.getElementById('theme-toggle')
    this.applyTheme(this.theme)
    this.setupEventListeners()
  }
  applyTheme = (theme) => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  toggleTheme = () => {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    this.applyTheme(this.theme)
  }

  setupEventListeners = () => {
    const eventThemeToggle = new Event('themeToggle')


    if (this.themeToggleButton) {
      this.themeToggleButton.addEventListener('click', () => {
        this.toggleTheme()

        window.dispatchEvent(eventThemeToggle)
      })
    }
  }
}