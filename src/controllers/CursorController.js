export class CursorController {
  constructor() {
    this.cursor = document.getElementById('custom-cursor')

    if (!this.cursor) return

    if (window.innerWidth > 768) this.init()
  }

  init() {
    this.cursor.className = 'custom-cursor'
    document.body.appendChild(this.cursor)

    document.addEventListener('mousemove', this.setCursorPosition)
  }
  setCursorPosition = (e) => {
    this.cursor.style.left = e.clientX + 'px'
    this.cursor.style.top = e.clientY + 'px'
  }
}
