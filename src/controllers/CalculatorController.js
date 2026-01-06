export class CalculatorController {
  constructor(controllerName, container) {
    this.classNameSelected = 'selected'
    this.container = container
    this.groups = Array.from(container.querySelectorAll(`[data-controller-${controllerName}="item"]`))
    this.itemsPriceTotal = Array.from(container.querySelectorAll(`[data-controller-${controllerName}-item="price-total"]`))

    this.checkboxOptions = Array.from(document.querySelectorAll('.checkbox-option'))
    this.totalElement = document.getElementById('total-price')

    this.init()
  }
  universalUpdatePrice = (container, index) => {
    const options = Array.from(container.querySelectorAll('.option-item'))

    if (container.dataset.type === 'multiply') {
      // Множественный выбор: клик toggles selected
      options.forEach((option) => {
        option.addEventListener('click', () => {
          option.classList.toggle('selected');

          // Суммируем цены всех selected в группе
          const selected = Array.from(container.querySelectorAll(`.${this.classNameSelected}`));
          const totalPrice = selected.reduce((sum, sel) => sum + parseInt(sel.dataset.price || 0), 0);
          const priceTotal = this.itemsPriceTotal[index];
          priceTotal.textContent = this.formatPrice(totalPrice);
          priceTotal.dataset.price = totalPrice;

          this.animateValue(priceTotal);
          this.updateTotal();
        });
      });
    } else {
      options.forEach((option) => {
        option.addEventListener('click', () => {
          // меняется для обычных и checkbox
          const optionPrice = container.querySelector(`.${this.classNameSelected}`)
          optionPrice.classList.remove('selected')

          option.classList.add('selected')

          const price = option.dataset.price
          const priceTotal = this.itemsPriceTotal[index]

          priceTotal.textContent = this.formatPrice(price)
          priceTotal.dataset.price = price

          this.animateValue(priceTotal)
          this.updateTotal()
        })
      })
    }
  }
  init = () => {
    this.groups.forEach((group, index) => {
      this.universalUpdatePrice(group, index)
    })

    this.updateTotal()
  }
  updateAdditionalOptions = () => {
    const additionalTotalR = Array.from(document.querySelectorAll('#additional-components .option-item.selected')).reduce((sum, item) => (sum += parseInt(item.dataset.price)), 0)
    const additionalPriceTotal = document.getElementById('additional-price-total')

    additionalPriceTotal.textContent = this.formatPrice(additionalTotalR)
    this.animateValue(additionalPriceTotal)
  }
  updateTotal = () => {
    const total = this.itemsPriceTotal.reduce((sum, item) => (sum += parseInt(item.dataset.price || 0)), 0)

    this.totalElement.textContent = this.formatPrice(total)
    this.animateValue(this.totalElement)
  }
  animateValue = (element) =>  {
    element.classList.add('price-changing')
    element.addEventListener('animationend', () => element.classList.remove('price-changing'))
  }
  formatPrice = (price) =>  {
    return parseInt(price).toLocaleString('ru-RU')
  }
}