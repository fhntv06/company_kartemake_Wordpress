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
      message: 'textarea[name="message"], textarea[data-field="message"]',
      type: 'select[name="type"], select[data-field="type"]',
      urgent: 'input[type="checkbox"][name="urgent"], input[type="checkbox"][data-field="urgent"]'
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
        // Для select и textarea тоже добавляем валидацию при blur
        if (field !== 'urgent') { // чекбокс обрабатываем отдельно
          this.fields[field].addEventListener('blur', () => this.validateField(field));
          this.fields[field].addEventListener('input', () => this.clearFieldError(field));
        }
      }
    });

    // Для select отдельно обрабатываем change
    if (this.fields.type) {
      this.fields.type.addEventListener('change', () => {
        this.validateField('type');
      });
    }

    // Для чекбокса - просто сбрасываем ошибку при изменении
    if (this.fields.urgent) {
      this.fields.urgent.addEventListener('change', () => {
        this.clearFieldError('urgent');
      });
    }

    document.addEventListener('reset-form', () => this.resetForm())
    document.addEventListener('fill-form-field', (e) => this.fillingFormField(e));
  }

  fillingFormField = (event) => {
    const { fieldName, value } = event.detail;

    if (!fieldName) {
      console.warn('fill-form-field: не указано имя поля');
      return;
    }

    // Ищем поле в форме
    const field = this.fields[fieldName];

    if (!field) {
      console.warn(`fill-form-field: поле "${fieldName}" не найдено в форме`);
      return;
    }

    // Заполняем поле
    if (field.tagName === 'TEXTAREA' || field.tagName === 'INPUT' || field.tagName === 'SELECT') {
      field.value = value;

      // Триггерим события для активации валидации и стилей
      const inputEvent = new Event('input', { bubbles: true });
      field.dispatchEvent(inputEvent);

      const changeEvent = new Event('change', { bubbles: true });
      field.dispatchEvent(changeEvent);

      // Очищаем ошибку для этого поля
      this.clearFieldError(fieldName);

      console.error(`fill-form-field: поле "${fieldName}" заполнено`);
    }
  };

  // Валидация конкретного поля
  validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return true;

    let value;
    if (fieldName === 'urgent') {
      value = field.checked;
    } else {
      value = field.value.trim();
    }

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
        errorMessage = 'Введите корректный номер телефона (например: +7 (999) 123-45-67)';
        break;

      case 'email':
        if (value) { // email не обязательное поле
          isValid = this.validateEmail(value);
          errorMessage = 'Введите корректный email адрес';
        }
        break;

      case 'message':
        isValid = this.validateMessage(value);
        errorMessage = 'Опишите задачу подробнее!';
        break;

      case 'type':
        isValid = this.validateType(value);
        errorMessage = 'Пожалуйста, выберите тип задачи';
        break;

      case 'urgent':
        // Чекбокс всегда валиден, просто сбрасываем ошибку если была
        return true;
    }

    if (!isValid) {
      this.showError(fieldName, errorMessage);
    } else {
      this.clearFieldError(fieldName);
    }

    return isValid;
  }

  // Валидация всех обязательных полей
  validateAll() {
    let isValid = true;

    // Проверяем только обязательные поля
    const requiredFields = ['name', 'phone', 'message', 'type'];
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Дополнительно проверяем email, если он заполнен
    if (this.fields.email && this.fields.email.value.trim()) {
      if (!this.validateField('email')) {
        isValid = false;
      }
    }

    return isValid;
  }

  // Валидация имени
  validateName(name) {
    return name.length >= 2 && /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name);
  }

  // Валидация компании
  validateCompany(company) {
    // Компания не обязательна, но если заполнена - проверяем
    if (company.length === 0) return true;
    return company.length >= 2;
  }

  // Валидация телефона
  validatePhone(phone) {
    // Более гибкая валидация российских телефонов
    const phoneRegex = /^[\+]?[7|8]?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Валидация email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Валидация сообщения
  validateMessage(message) {
    return message.length > 10; // Минимум 10 символов для описания задачи
  }

  // Валидация типа задачи
  validateType(type) {
    return type !== ''; // Не должно быть пустым
  }

  // Показать ошибку
  showError(fieldName, message) {
    this.clearFieldError(fieldName);

    const field = this.fields[fieldName];
    if (!field) return;

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--accent-red, red)';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    errorElement.style.marginBottom = '10px';

    // Для разных типов полей разное позиционирование ошибки
    let parentNode = field.parentNode;

    // Для select и textarea находим обертку
    if (field.tagName === 'SELECT' || field.tagName === 'TEXTAREA') {
      parentNode = field.parentNode;
    }

    // Для checkbox ищем контейнер
    if (field.type === 'checkbox') {
      parentNode = field.closest('.checkbox-group') || field.parentNode;
    }

    parentNode.appendChild(errorElement);

    // Добавляем класс ошибки к полю
    field.classList.add('error');

    // Для select и input меняем border
    if (field.tagName === 'SELECT' || field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
      field.style.borderColor = 'var(--accent-red, red)';
    }

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
      field.classList.remove('error');
      if (field.tagName === 'SELECT' || field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
        field.style.borderColor = '';
      }
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
    } else {
      // Прокрутка к первой ошибке
      const firstErrorField = Object.keys(this.errors)[0];
      if (firstErrorField && this.fields[firstErrorField]) {
        this.fields[firstErrorField].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }

  // Получить данные формы
  getFormData() {
    const data = {};

    Object.keys(this.fields).forEach(field => {
      if (this.fields[field]) {
        if (field === 'urgent') {
          data[field] = this.fields[field].checked ? 'Да' : 'Нет';
        } else {
          data[field] = this.fields[field].value.trim();
        }
      }
    });

    // Добавляем метаданные
    data.timestamp = new Date().toISOString();
    data.pageUrl = window.location.href;
    data.formType = this.form.closest('[data-form-type]')?.dataset.formType || 'contact';

    return data;
  }

  // Форматирование данных для отправки
  formatDataForDisplay(data) {
    let result = '=== Новая заявка ===\n\n';

    const fieldLabels = {
      name: '👤 Имя',
      company: '🏢 Компания',
      phone: '📞 Телефон',
      email: '📧 Email',
      type: '🎯 Тип задачи',
      urgent: '⚡ Срочная задача',
      message: '📝 Описание задачи'
    };

    Object.keys(fieldLabels).forEach(field => {
      if (data[field] && data[field] !== '') {
        result += `${fieldLabels[field]}: ${data[field]}\n`;
      }
    });

    result += `\n📅 Время отправки: ${new Date(data.timestamp).toLocaleString('ru-RU')}`;
    result += `\n🌐 Страница: ${data.pageUrl}`;

    return result;
  }

  // Отправить форму
  async submitForm() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    try {
      const formData = this.getFormData();

      // Показываем состояние отправки
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
      submitButton.disabled = true;

      // Симуляция отправки на сервер (замените на реальный fetch)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // В реальном приложении здесь будет fetch:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Форматируем данные для уведомления
      const formattedMessage = this.formatDataForDisplay(formData);

      // Можно отправлять в Telegram или другую систему
      // this.sendToTelegram(formattedMessage);

      // Показываем успешное сообщение
      this.showSuccessMessage();

      // Сбрасываем форму
      this.resetForm();

    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      this.showError('form', 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.');
    } finally {
      // Восстанавливаем кнопку
      const submitButton = this.form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
    }
  }

  // Показать сообщение об успехе
  showSuccessMessage() {
    // Проверяем, что форма существует
    if (!this.form || !this.form.parentNode) return;

    // Создаем элемент для сообщения об успехе
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.innerHTML = `
    <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <i class="fas fa-check-circle" style="color: #28a745; margin-right: 10px;"></i>
      <strong>Спасибо!</strong> Ваша задача отправлена. Мы свяжемся с вами в течение 24 часов.
    </div>
  `;

    // Вставляем перед формой или вместо нее
    this.form.parentNode.insertBefore(successElement, this.form);

    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
      if (successElement && successElement.parentNode) {
        successElement.remove();
      }
    }, 5000);
  }

  // Отправить в Telegram (опционально)
  async sendToTelegram(message) {
    // В реальном приложении добавьте ваш Telegram Bot Token и Chat ID
    const botToken = 'YOUR_BOT_TOKEN';
    const chatId = 'YOUR_CHAT_ID';

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
    }
  }

  // Сброс формы
  resetForm() {
    if (this.form) {
      this.form.reset();

      // Сбрасываем select к значению по умолчанию
      if (this.fields.type) {
        this.fields.type.selectedIndex = 0;
      }
    }

    this.clearAllErrors();
  }

  // Установка кастомных сообщений об ошибках
  setCustomErrorMessages(messages) {
    this.customErrorMessages = { ...this.customErrorMessages, ...messages };
  }
}