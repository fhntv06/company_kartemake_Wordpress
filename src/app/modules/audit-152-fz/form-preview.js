/**
 * Frontend-only behaviour for the Audit 152-ФЗ static preview.
 * The form is deliberately not connected to a backend at this stage.
 * Replace this preview handler during WordPress integration.
 */
export default class Audit152FormPreview {
    constructor() {
        this.form = document.querySelector('#audit152-form')
        this.status = document.querySelector('#audit152-form-status')

        if (!this.form || !this.status) return

        this.form.addEventListener('submit', (event) => this.handleSubmit(event))
    }

    handleSubmit(event) {
        event.preventDefault()
        this.status.textContent = ''

        const data = new FormData(this.form)
        const phone = String(data.get('phone') || '').trim()
        const email = String(data.get('email') || '').trim()
        const consent = this.form.querySelector('[name="consent"]')

        if (!phone && !email) {
            this.status.textContent = 'Укажите телефон или email для обратной связи.'
            this.form.querySelector('[name="phone"]').setAttribute('aria-invalid', 'true')
            this.form.querySelector('[name="email"]').setAttribute('aria-invalid', 'true')
            return
        }

        if (!consent || !consent.checked) {
            this.status.textContent = 'Для отправки заявки необходимо подтвердить согласие на обработку персональных данных.'
            consent?.focus()
            return
        }

        this.status.textContent = 'Форма интерфейса работает. Реальная отправка будет подключена на этапе интеграции с WordPress.'
    }
}
