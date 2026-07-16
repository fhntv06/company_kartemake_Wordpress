export class AccordionController {
  constructor(controllerName, container) {
    this.items = container.querySelectorAll(`[data-controller-${controllerName}="item"]`)

    if (!this.items.length) {
      throw new Error(`No have controller items in ${controllerName}`)
    }

    this.init()
    this.setupResizeObserver()
  }

  init() {
    this.items.forEach(item => {
      const answer = item.querySelector('.accordion-answer')
      if (!answer) return

      // Только JS-свойства
      answer.style.overflow = 'hidden'
      answer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      answer.style.maxHeight = '0'

      const trigger = item.querySelector('.accordion-trigger') || item
      trigger.addEventListener('click', () => {
        this.toggleItem(item)
      })
    })
  }

  toggleItem(item) {
    const answer = item.querySelector('.accordion-answer')
    if (!answer) return

    const isActive = item.classList.contains('active')

    // Закрываем другие
    this.items.forEach(other => {
      if (other !== item && other.classList.contains('active')) {
        const otherAnswer = other.querySelector('.accordion-answer')
        if (otherAnswer) {
          other.classList.remove('active')
          otherAnswer.style.maxHeight = '0'
        }
      }
    })

    if (isActive) {
      item.classList.remove('active')
      answer.style.maxHeight = '0'
    } else {
      item.classList.add('active')
      // Вычисляем высоту на основе CSS
      const height = this.getFullHeight(answer)
      answer.style.maxHeight = height + 'px'
    }
  }

  // Получаем высоту с учетом всех CSS-стилей
  getFullHeight(element) {
    // Сохраняем текущие стили
    const originalDisplay = element.style.display
    const originalMaxHeight = element.style.maxHeight
    const originalVisibility = element.style.visibility

    // Делаем видимым для вычислений
    element.style.display = 'block'
    element.style.maxHeight = 'none'
    element.style.visibility = 'hidden' // Невидимо, но занимает место

    // Получаем высоту
    const height = element.scrollHeight

    // Восстанавливаем
    element.style.display = originalDisplay || ''
    element.style.maxHeight = originalMaxHeight || ''
    element.style.visibility = originalVisibility || ''

    return height
  }

  // Автоматическое обновление при изменении контента
  setupResizeObserver() {
    if (!window.ResizeObserver) return

    this.items.forEach(item => {
      const answer = item.querySelector('.accordion-answer')
      if (!answer) return

      const observer = new ResizeObserver(() => {
        if (item.classList.contains('active')) {
          const height = this.getFullHeight(answer)
          answer.style.maxHeight = height + 'px'
        }
      })

      observer.observe(answer)
      // Сохраняем для очистки
      answer._observer = observer
    })
  }

  // Метод для ручного обновления
  refresh() {
    this.items.forEach(item => {
      if (item.classList.contains('active')) {
        const answer = item.querySelector('.accordion-answer')
        if (answer) {
          const height = this.getFullHeight(answer)
          answer.style.maxHeight = height + 'px'
        }
      }
    })
  }

  destroy() {
    this.items.forEach(item => {
      const answer = item.querySelector('.accordion-answer')
      if (answer && answer._observer) {
        answer._observer.disconnect()
        delete answer._observer
      }
    })
  }
}