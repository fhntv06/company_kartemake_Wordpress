export class AccordionController {
  constructor() {
    this.faqItems = document.querySelectorAll('.faq-item');

    if (!this.faqItems.length) return

    this.init()
  }
  init = () => {
    // FAQ аккордеон
    this.faqItems.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('active');
      })
    })
  }
}