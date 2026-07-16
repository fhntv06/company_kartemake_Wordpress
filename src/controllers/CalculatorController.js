export class CalculatorController {
  constructor(controllerName, container) {
    this.classNameSelected = 'selected'
    this.container = container
    this.groups = Array.from(container.querySelectorAll(`[data-controller-${controllerName}="item"]`))

    this.projectPriceElement = document.getElementById('project-price')
    this.monthlyPriceElement = document.getElementById('monthly-price')
    this.yearlyPriceElement = document.getElementById('yearly-price')

    this.init()
  }

  universalUpdatePrice = (container) => {
    const options = Array.from(container.querySelectorAll('.option-item'))

    if (container.dataset.type === 'multiply') {
      // Множественный выбор: клик toggles selected
      options.forEach((option) => {
        option.addEventListener('click', () => {
          option.classList.toggle('selected')
          this.updateTotals()
        })
      })
    } else {
      // Единичный выбор
      options.forEach((option) => {
        option.addEventListener('click', () => {
          // Находим все опции в этой группе и снимаем выделение
          const selectedOptions = container.querySelectorAll(`.${this.classNameSelected}`)
          selectedOptions.forEach(selected => selected.classList.remove('selected'))

          // Выделяем текущую опцию
          option.classList.add('selected')

          this.updateTotals()
        })
      })
    }
  }

  init = () => {
    this.groups.forEach((group) => {
      this.universalUpdatePrice(group)
    })

    this.updateTotals()
  }

  updateTotals = () => {
    let projectTotal = 0
    let monthlyTotal = 0
    let yearlyTotal = 0

    // Проходим по всем группам
    this.groups.forEach((group) => {
      const selectedOptions = Array.from(group.querySelectorAll(`.${this.classNameSelected}`))

      // Обрабатываем каждую выбранную опцию
      selectedOptions.forEach((option) => {
        const price = parseInt(option.dataset.price || 0)
        const priceText = option.querySelector('.option-price').textContent

        // Определяем тип стоимости по тексту цены и классу группы
        if (priceText.includes('/мес')) {
          monthlyTotal += price
        } else if (priceText.includes('/год')) {
          yearlyTotal += price
        } else {
          // Это разовая стоимость (проект)
          projectTotal += price
        }
      })
    })

    // Обновляем все итоговые элементы
    if (this.projectPriceElement) {
      this.projectPriceElement.textContent = this.formatPrice(projectTotal)
      this.animateValue(this.projectPriceElement)
    }

    if (this.monthlyPriceElement) {
      this.monthlyPriceElement.textContent = this.formatPrice(monthlyTotal)
      this.animateValue(this.monthlyPriceElement)
    }

    if (this.yearlyPriceElement) {
      // Годовая стоимость = проект + (ежемесячная * 12) + годовая
      const yearlySum = projectTotal + (monthlyTotal * 12) + yearlyTotal
      this.yearlyPriceElement.textContent = this.formatPrice(yearlySum)
      this.animateValue(this.yearlyPriceElement)
    }
  }

  animateValue = (element) => {
    element.classList.add('price-changing')
    element.addEventListener('animationend', () => element.classList.remove('price-changing'))
  }

  formatPrice = (price) => {
    return parseInt(price).toLocaleString('ru-RU')
  }

  saveEstimate = () => {
    const estimateData = {
      projectTotal: this.projectPriceElement ? this.projectPriceElement.textContent : '0',
      monthlyTotal: this.monthlyPriceElement ? this.monthlyPriceElement.textContent : '0',
      yearlyTotal: this.yearlyPriceElement ? this.yearlyPriceElement.textContent : '0',
      timestamp: new Date().toISOString()
    }

    // Можно сохранить в localStorage или отправить на сервер
    localStorage.setItem('kartech_estimate', JSON.stringify(estimateData))

    // Создаем ссылку для скачивания
    const dataStr = JSON.stringify(estimateData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const a = document.createElement('a')
    a.href = url
    a.download = `kartech-estimate-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}