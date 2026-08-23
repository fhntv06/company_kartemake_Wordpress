/*
==========================================================
K·ART·MAKE V5.2

TRANSITION LOADER

Particle logo transition.

FLOW:

cover()
 |
 | black screen
 |
 | particles appear
 |
 | particles build K·ART·MAKE
 |
hold()
 |
 | waiting navigation
 |
reveal()
 |
 | particles explode
 |
 | canvas fade out


==========================================================
*/
export default class TransitionLoader {
  constructor() {
    console.log("[TransitionLoader] ready")

    this.canvas = null
    this.ctx = null
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.particles = []
    this.active = false
    this.phase = "idle"
    this.logoReady = false
    this.config = {
      particleCount: Math.max(1500, window.innerWidth),
      logoText: "K·ART·MAKE",
      fontFamily:"Arial",
      fontWeight:"900",
      maxFontSize:220,
      minFontSize:80,
      color: "255,107,0",
      background: "5,5,8",
      buildDuration: 1000,
      explodeDuration: 500,
      fadeDuration: 400
    }
    this.init()
  }

  ////////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////////
  init() {
    this.createCanvas()
    this.ctx = this.canvas.getContext("2d")
    this.resize()
    window.addEventListener("resize", () => this.resize())
  }

  ////////////////////////////////////////////////////////
  // CANVAS
  ////////////////////////////////////////////////////////
  createCanvas() {
    this.canvas = document.createElement("canvas")
    this.canvas.className = "transition-loader-canvas"
    Object.assign(this.canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      zIndex: "99999",
      pointerEvents: "none",
      opacity: "0",
      visibility: "hidden"
    })
    document.body.appendChild(this.canvas)
  }

  ////////////////////////////////////////////////////////
  // RESIZE
  ////////////////////////////////////////////////////////
  resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr
    this.canvas.style.width = this.width + "px"
    this.canvas.style.height = this.height + "px"
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  ////////////////////////////////////////////////////////
  // CREATE TEXT MASK
  ////////////////////////////////////////////////////////
  createTextPoints() {
    const count = this.config.particleCount
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = this.width
    canvas.height = this.height

    let fontSize = Math.sqrt(count) * 13
    // ограничение по количеству частиц
    fontSize = Math.min(fontSize, 420)
    ctx.font = `900 ${fontSize}px Arial`
    // проверяем реальную ширину текста
    const textWidth = ctx.measureText(this.config.logoText).width
    // максимум 80% экрана
    const maxWidth = this.width * 0.8
    if (textWidth > maxWidth) {
      fontSize *= maxWidth / textWidth
    }
    ctx.font = `900 ${fontSize}px Arial`

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#fff"
    ctx.fillText(this.config.logoText, this.width / 2, this.height / 2)
    const data = ctx.getImageData(0, 0, this.width, this.height)
    const raw = []
    for (let y = 0; y < this.height; y += 2) {
      for (let x = 0; x < this.width; x += 2) {
        const i = (y * this.width + x) * 4
        if (data.data[i] > 0) {
          raw.push({ x, y })
        }
      }
    }
    return this.distributePoints(raw, count)
  }

  distributePoints(points, count) {
    const result = []
    const step = Math.floor(points.length / count)
    for (let i = 0; i < count; i++) {
      let index = i * step
      result.push(points[index])
    }
    return result
  }

  ////////////////////////////////////////////////////////
  // CREATE PARTICLES
  ////////////////////////////////////////////////////////
  createParticles() {
    const points = this.createTextPoints()
    this.particles = []
    for (let i = 0; i < this.config.particleCount; i++) {
      const target = points[Math.floor(Math.random() * points.length)]
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        startX: Math.random() * this.width,
        startY: Math.random() * this.height,
        targetX: target.x,
        targetY: target.y,
        size: Math.random() * (2 - 0.2) + 0.5,
        alpha: .65 + Math.random() * .35,
        delay: Math.random() * 0.25
      })
    }
  }

  ////////////////////////////////////////////////////////
  // COVER
  ////////////////////////////////////////////////////////
  async cover() {
    if (this.active) return
    this.active = true
    this.phase = "build"
    this.createParticles()
    await this.fadeIn()
    const start = performance.now()
    return new Promise(resolve => {
      const loop = () => {
        let t = (performance.now() - start) / this.config.buildDuration
        t = Math.min(1, t)
        this.drawBackground()
        this.particles.forEach(p => {
          let progress = Math.max(0, (t - p.delay) / (1 - p.delay))
          progress = this.ease(progress)
          p.x = p.startX + (p.targetX - p.startX) * progress
          p.y = p.startY + (p.targetY - p.startY) * progress
          this.drawParticle(p)
        })
        if (t >= 1) {
          this.logoReady = true
          resolve()
          return
        }
        requestAnimationFrame(loop)
      }
      loop()
    })
  }

  ////////////////////////////////////////////////////////
  // WAIT
  ////////////////////////////////////////////////////////
  hold() {
    return new Promise(resolve => {
      this.resolveHold = resolve
    })
  }

  ////////////////////////////////////////////////////////
  // REVEAL
  ////////////////////////////////////////////////////////
  async reveal() {
    const start = performance.now()
    return new Promise(resolve => {
      const loop = () => {
        let t = (performance.now() - start) / this.config.explodeDuration
        t = Math.min(1, t)
        t = this.ease(t)
        this.drawBackground()
        this.particles.forEach(p => {
          const angle = Math.atan2(p.y - this.height / 2, p.x - this.width / 2)
          p.x += Math.cos(angle) * 20 * t
          p.y += Math.sin(angle) * 20 * t
          this.drawParticle(p)
        })
        this.canvas.style.opacity = String(1 - t)
        if (t >= 1) {
          this.finish()
          resolve()
          return
        }
        requestAnimationFrame(loop)
      }
      loop()
    })
  }

  ////////////////////////////////////////////////////////
  // DRAW
  ////////////////////////////////////////////////////////
  drawBackground() {
    this.ctx.fillStyle = `rgb(${this.config.background})`
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  drawParticle(p) {
    this.ctx.beginPath()
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    this.ctx.fillStyle = `rgba(${this.config.color},${p.alpha})`
    this.ctx.fill()
  }

  ////////////////////////////////////////////////////////
  // FADE IN
  ////////////////////////////////////////////////////////
  fadeIn() {
    this.canvas.style.visibility = "visible"
    return new Promise(resolve => {
      gsap.to(this.canvas, {
        opacity: 1,
        duration: .35,
        ease: "power2.out",
        onComplete: resolve
      })
    })
  }

  ////////////////////////////////////////////////////////
  // EASE
  ////////////////////////////////////////////////////////
  ease(t) {
    return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }

  ////////////////////////////////////////////////////////
  // FINISH
  ////////////////////////////////////////////////////////
  finish() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.canvas.style.opacity = "0"
    this.canvas.style.visibility = "hidden"
    this.active = false
    this.phase = "idle"
  }
}
