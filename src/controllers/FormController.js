export class FormController {
  constructor(controllerName, container) {
    this.form = container;
    this.fields = {};
    this.errors = {};
    this.init();
  }

  // Инициализация контроллера
  init() {
    if (!this.form) {
      console.error('Форма не найдена');
      return;
    }

    this.setupFields();
    this.setupEventListeners();
  }

  // Настройка полей формы
  setupFields() {
    const fieldSelectors = {
      name: 'input[name="name"], input[data-field="name"]',
      company: 'input[name="company"], input[data-field="company"]',
      phone: 'input[type="tel"], input[name="phone"], input[data-field="phone"]',
      email: 'input[type="email"], input[name="email"], input[data-field="email"]',
      message: 'textarea[name="message"], textarea[data-field="message"]'
    };

    Object.keys(fieldSelectors).forEach(field => {
      this.fields[field] = this.form.querySelector(fieldSelectors[field]);
    });
  }

  // Настройка обработчиков событий
  setupEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Валидация при изменении полей
    Object.keys(this.fields).forEach(field => {
      if (this.fields[field]) {
        this.fields[field].addEventListener('blur', () => this.validateField(field));
        this.fields[field].addEventListener('input', () => this.clearFieldError(field));
      }
    });
  }

  // Валидация конкретного поля
  validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return true;

    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        isValid = this.validateName(value);
        errorMessage = 'Имя должно содержать только буквы и быть не короче 2 символов';
        break;

      case 'company':
        isValid = this.validateCompany(value);
        errorMessage = 'Название компании должно быть не короче 2 символов';
        break;

      case 'phone':
        isValid = this.validatePhone(value);
        errorMessage = 'Введите корректный номер телефона';
        break;

      case 'email':
        isValid = this.validateEmail(value);
        errorMessage = 'Введите корректный email адрес';
        break;

      case 'message':
        isValid = this.validateMessage(value);
        errorMessage = 'Сообщение не должно быть пустым';
        break;
    }

    if (!isValid) {
      this.showError(fieldName, errorMessage);
    } else {
      this.clearFieldError(fieldName);
    }

    return isValid;
  }

  // Валидация всех полей
  validateAll() {
    let isValid = true;

    Object.keys(this.fields).forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Валидация имени
  validateName(name) {
    return name.length >= 2 && /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name);
  }

  // Валидация компании
  validateCompany(company) {
    return company.length >= 2;
  }

  // Валидация телефона
  validatePhone(phone) {
    // Простая валидация телефона (можно адаптировать под нужный формат)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Валидация email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Валидация сообщения
  validateMessage(message) {
    return message.length > 0;
  }

  // Показать ошибку
  showError(fieldName, message) {
    this.clearFieldError(fieldName);

    const field = this.fields[fieldName];
    if (!field) return;

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';

    field.parentNode.appendChild(errorElement);
    field.style.borderColor = 'red';

    this.errors[fieldName] = errorElement;
  }

  // Очистить ошибку поля
  clearFieldError(fieldName) {
    if (this.errors[fieldName]) {
      this.errors[fieldName].remove();
      delete this.errors[fieldName];
    }

    const field = this.fields[fieldName];
    if (field) {
      field.style.borderColor = '';
    }
  }

  // Очистить все ошибки
  clearAllErrors() {
    Object.keys(this.errors).forEach(field => {
      this.clearFieldError(field);
    });
  }

  // Обработка отправки формы
  handleSubmit(e) {
    e.preventDefault();

    this.clearAllErrors();

    if (this.validateAll()) {
      this.submitForm();
    }
  }

  // Получить данные формы
  getFormData() {
    const data = {};

    Object.keys(this.fields).forEach(field => {
      if (this.fields[field]) {
        data[field] = this.fields[field].value.trim();
      }
    });

    return data;
  }

  // Отправить форму (можно переопределить)
  submitForm() {
    const formData = this.getFormData();
    console.log('Данные формы:', formData);

    // Здесь можно добавить отправку на сервер
    // Например: fetch('/submit', { method: 'POST', body: JSON.stringify(formData) })

    alert('Форма успешно отправлена!');
    this.form.reset();
  }
  // Сброс формы
  resetForm() {
    this.form.reset();
    this.clearAllErrors();
  }
  // Установка кастомных сообщений об ошибках
  setCustomErrorMessages(messages) {
    this.customErrorMessages = { ...this.customErrorMessages, ...messages };
  }
}
