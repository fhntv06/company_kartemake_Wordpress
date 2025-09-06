export class StarfieldController {
  constructor(controllerName, container) {
    this.canvas = container.querySelector(`[data-controller-${controllerName}="item"]`)
    this.ctx = this.canvas.getContext('2d')
    this.starCount = 500
    this.stars = []
    this.theme = localStorage.getItem('theme') || 'light'
    this.animationId = null

    this.init()
  }
  init = () => {
    this.setupCanvas()
    this.createStars()
    this.startAnimation()

    window.addEventListener('themeToggle', () => {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.drawStars()
    })
  }
  setupCanvas = () => {
    this.resizeCanvas()
    window.addEventListener('resize', () => {
      this.resizeCanvas()
      this.createStars()
    })
  }
  resizeCanvas = () => {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }
  createStars = () => {
    this.stars = []

    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1
      })
    }
  }
  getStarColor = () => {
    // red
    return 'rgba(255, 46, 46, {opacity})'

    // white and black
    // return this.theme === 'light'
    //   ? 'rgba(17, 17, 17, {opacity})'
    //   : 'rgba(245, 245, 245, {opacity})'
  }
  drawStars = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.stars.forEach(star => {
      // Обновление мерцания
      star.opacity += star.twinkleSpeed * star.twinkleDirection

      if (star.opacity > 0.8 || star.opacity < 0.2) {
        star.twinkleDirection *= -1
      }

      // Рисование звезды
      this.ctx.beginPath()
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)

      this.ctx.fillStyle = this.getStarColor().replace('{opacity}', star.opacity)
      this.ctx.fill()

      // Движение звезд (опционально)
      star.y += star.speed
      if (star.y > this.canvas.height) {
        star.y = 0
        star.x = Math.random() * this.canvas.width
      }
    })
  }
  animate = () => {
    this.drawStars()
    this.animationId = requestAnimationFrame(() => this.animate())
  }
  startAnimation = () => {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.animate()
  }
  // Публичные методы для управления
  setStarCount(count) {
    this.starCount = count
    this.createStars()
  }
  destroy = () => {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    window.removeEventListener('resize', this.resizeCanvas)
  }
}
