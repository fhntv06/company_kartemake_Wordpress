export class SpecialistWidgetController {
      constructor(controllerName, container) {
        this.element = container

        this.config = {
          juniorRate: 500,
          middleRate: 1000,
          seniorRate: 2000,
          requiredMessage: 'Пожалуйста, выберите вариант'
        };

        this.state = {
          currentStep: 1,
          selectedTask: '',
          selectedComplexity: '',
          selectedHours: 4,
          selectedLevel: '',
          isValid: false
        };

        this.elements = {};
        this.errorTimeout = null;

        this.init()
      }

      init() {
        this.element.classList.add('visible');

        this.cacheElements();
        this.bindEvents();
        this.updateUI();
        this.setupClickOutside();
        this.validateCurrentStep();
      }

      cacheElements() {
        // Основные элементы
        this.elements.trigger = this.element.querySelector('[data-widget-trigger]');
        this.elements.modal = this.element.querySelector('[data-widget-modal]');
        this.elements.closeBtn = this.element.querySelector('[data-widget-close]');

        // Навигация
        this.elements.nextBtn = this.element.querySelector('[data-widget-next]');
        this.elements.prevBtn = this.element.querySelector('[data-widget-prev]');

        // Шаги
        this.elements.steps = Array.from(this.element.querySelectorAll('[data-widget-step]'));

        // Опции
        this.elements.taskOptions = Array.from(this.element.querySelectorAll('[data-widget-task]'));
        this.elements.complexityOptions = Array.from(this.element.querySelectorAll('[data-widget-complexity]'));
        this.elements.specialistOptions = Array.from(this.element.querySelectorAll('[data-widget-specialist]'));

        // Поля ввода
        this.elements.hoursInput = this.element.querySelector('[data-widget-hours]');
        this.elements.otherText = this.element.querySelector('[data-widget-other-text]');

        // Результаты
        this.elements.resultHours = this.element.querySelector('[data-widget-result-hours]');
        this.elements.priceJunior = this.element.querySelector('[data-widget-price-junior]');
        this.elements.priceMiddle = this.element.querySelector('[data-widget-price-middle]');
        this.elements.priceSenior = this.element.querySelector('[data-widget-price-senior]');

        // Прогресс
        this.elements.progressSteps = Array.from(this.element.querySelectorAll('[data-widget-progress-step]'));

        // Кнопки действий
        this.elements.discussBtn = this.element.querySelector('[data-widget-discuss]');
        this.elements.supportBtn = this.element.querySelector('[data-widget-support]');

        // Сообщения об ошибках
        this.elements.errorContainer = this.element.querySelector('[data-widget-error]');
        if (!this.elements.errorContainer) {
          // Создаем контейнер для ошибок, если его нет
          this.elements.errorContainer = document.createElement('div');
          this.elements.errorContainer.className = 'widget-error';
          this.elements.errorContainer.setAttribute('data-widget-error', '');
          this.elements.errorContainer.style.display = 'none';
          this.elements.steps[0].parentNode.insertBefore(
            this.elements.errorContainer,
            this.elements.steps[0]
          );
        }
      }

      bindEvents() {
        // Открытие/закрытие
        this.elements.trigger.addEventListener('click', () => this.toggleModal());
        this.elements.closeBtn.addEventListener('click', () => this.closeModal());

        // Навигация
        this.elements.nextBtn.addEventListener('click', () => this.nextStep());
        this.elements.prevBtn.addEventListener('click', () => this.prevStep());

        // Выбор опций
        this.elements.taskOptions.forEach(option => {
          option.addEventListener('click', (e) => this.selectTask(e));
        });

        this.elements.complexityOptions.forEach(option => {
          option.addEventListener('click', (e) => this.selectComplexity(e));
        });

        this.elements.specialistOptions.forEach(option => {
          option.addEventListener('click', (e) => this.selectSpecialist(e));
        });

        // Ввод данных
        if (this.elements.hoursInput) {
          this.elements.hoursInput.addEventListener('change', () => this.updateHours());
          this.elements.hoursInput.addEventListener('input', () => this.updateHours());
        }

        if (this.elements.otherText) {
          this.elements.otherText.addEventListener('input', () => {
            if (this.state.selectedTask === 'other') {
              this.validateCurrentStep();
            }
          });
        }

        // Кнопки действий
        if (this.elements.discussBtn) {
          this.elements.discussBtn.addEventListener('click', () => this.openMainForm());
        }

        if (this.elements.supportBtn) {
          this.elements.supportBtn.addEventListener('click', () => this.goToSupportCalculator());
        }

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.elements.modal.classList.contains('active')) {
            this.closeModal();
          }
        });
      }

      setupClickOutside() {
        document.addEventListener('click', (e) => {
          if (!this.element.contains(e.target) &&
            !e.target.closest('#specialistWidget') &&
            this.elements.modal.classList.contains('active')) {
            this.closeModal();
          }
        });
      }

      // Основные методы
      toggleModal() {
        if (window.innerWidth <= 768) {
          document.body.style.overflow = 'hidden';
        }
        this.elements.modal.classList.toggle('active');
        if (this.elements.modal.classList.contains('active')) {
          this.resetToFirstStep();
        }
      }

      closeModal() {
        if (window.innerWidth <= 768) {
          document.body.style.overflow = '';
        }
        this.elements.modal.classList.remove('active');
        this.hideError();
      }

      selectTask(event) {
        const button = event.currentTarget;

        // Снять выделение со всех кнопок
        this.elements.taskOptions.forEach(b => b.classList.remove('active'));

        // Выделить выбранную
        button.classList.add('active');

        // Обновить состояние
        this.state.selectedTask = button.dataset.task;

        // Показать/скрыть поле для "Другое"
        if (this.elements.otherText) {
          if (this.state.selectedTask === 'other') {
            this.elements.otherText.style.display = 'block';
            this.elements.otherText.focus();
          } else {
            this.elements.otherText.style.display = 'none';
          }
        }

        this.validateCurrentStep();
      }

      selectComplexity(event) {
        const button = event.currentTarget;

        // Снять выделение
        this.elements.complexityOptions.forEach(b => b.classList.remove('active'));

        // Выделить выбранную
        button.classList.add('active');

        // Обновить состояние
        this.state.selectedComplexity = button.dataset.level;
        this.state.selectedHours = parseInt(button.dataset.hours);
        this.state.selectedLevel = button.dataset.level;

        // Обновить поле ввода
        if (this.elements.hoursInput) {
          this.elements.hoursInput.value = this.state.selectedHours;
        }

        // Обновить выбор специалиста
        this.updateSpecialistSelection();
        this.validateCurrentStep();
      }

      updateHours() {
        if (!this.elements.hoursInput) return;

        const value = parseInt(this.elements.hoursInput.value) || 4;
        this.state.selectedHours = Math.max(1, Math.min(100, value));
        this.elements.hoursInput.value = this.state.selectedHours;

        // Обновить выбранную сложность на основе часов
        if (this.state.selectedHours <= 2) {
          this.state.selectedComplexity = 'junior';
          this.state.selectedLevel = 'junior';
        } else if (this.state.selectedHours <= 8) {
          this.state.selectedComplexity = 'middle';
          this.state.selectedLevel = 'middle';
        } else {
          this.state.selectedComplexity = 'senior';
          this.state.selectedLevel = 'senior';
        }

        this.updateComplexitySelection();
        this.updateSpecialistSelection();
        this.validateCurrentStep();
      }

      selectSpecialist(event) {
        const option = event.currentTarget;

        // Снять выделение
        this.elements.specialistOptions.forEach(o => o.classList.remove('active'));

        // Выделить выбранную
        option.classList.add('active');

        // Обновить состояние
        this.state.selectedLevel = option.dataset.level;
        this.validateCurrentStep();
      }

      nextStep() {
        // Проверить валидность текущего шага
        if (!this.validateCurrentStep()) {
          this.showError(this.config.requiredMessage);
          return;
        }

        if (this.state.currentStep < 4) {
          // Скрыть текущий шаг
          this.elements.steps[this.state.currentStep - 1].classList.remove('active');

          // Показать следующий
          this.state.currentStep++;
          this.elements.steps[this.state.currentStep - 1].classList.add('active');

          // Обновить прогресс
          this.updateProgress();

          // Если перешли на шаг с результатами, обновить цены
          if (this.state.currentStep === 4) {
            this.updatePrices();
          }

          // Скрыть ошибку
          this.hideError();
        }

        this.updateButtons();
        this.validateCurrentStep();
      }

      prevStep() {
        if (this.state.currentStep > 1) {
          // Скрыть текущий шаг
          this.elements.steps[this.state.currentStep - 1].classList.remove('active');

          // Показать предыдущий
          this.state.currentStep--;
          this.elements.steps[this.state.currentStep - 1].classList.add('active');

          // Обновить прогресс
          this.updateProgress();

          // Скрыть ошибку
          this.hideError();
        }

        this.updateButtons();
        this.validateCurrentStep();
      }

      // ВАЖНО: Интеграция с основной формой сайта
      openMainForm() {
        // 1. Получить все данные из виджета
        const calculation = this.getCalculation();

        // 2. Сформировать сообщение для формы
        const message = this.formatFormMessage(calculation);

        // 3. Найти основную форму сайта (по ID или селектору)
        const mainForm = this.findMainForm();

        if (mainForm) {
          // 4. Предзаполнить поля основной формы
          this.prefillMainForm(mainForm, calculation, message);

          // 5. Закрыть виджет
          this.closeModal();

          // 7. Прокрутить к форме
          mainForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // Fallback: показать сообщение
          this.showMessage(
            'Данные сохранены!<br>Сейчас откроется форма для обсуждения с менеджером.',
            'success'
          );

          // Сохранить данные в sessionStorage для основной формы
          this.saveToSessionStorage(calculation);

          // Перенаправить на страницу с формой
          setTimeout(() => {
            window.location.href = 'contacts.html?from=widget&calculation=' +
              encodeURIComponent(JSON.stringify(calculation));
          }, 1500);
        }
      }

      findMainForm() {
        // Ищем форму по разным возможным селекторам
        const selectors = [
          '#form',
          '#contact-form',
          '.contact-form',
          'form[data-controller="form"]',
          '.modal-form'
        ];

        for (const selector of selectors) {
          const form = document.querySelector(selector);
          if (form) return form;
        }

        return null;
      }

      prefillMainForm(form, calculation, message) {
        // Маппинг полей виджета -> поля формы
        const fieldMapping = {
          name: '', // Оставляем пустым для заполнения пользователем
          company: '', // Оставляем пустым
          email: '', // Оставляем пустым
          phone: '', // Оставляем пустым
          message,
        };

        // Заполняем поля формы
        ['name', 'company', 'email', 'phone', 'message'].forEach(fieldName => {
          document.dispatchEvent(
            new CustomEvent('fill-form-field',
            {
              detail: { fieldName: fieldName, value: fieldMapping[fieldName] }
            }
          ));
        });

        // Добавляем скрытое поле с данными виджета
        let hiddenField = form.querySelector('input[name="widget_data"]');
        if (!hiddenField) {
          hiddenField = document.createElement('input');
          hiddenField.type = 'hidden';
          hiddenField.name = 'widget_data';
          form.appendChild(hiddenField);
        }
        hiddenField.value = JSON.stringify(calculation);
      }

      openModal(modalId) {
        // Ищем модальное окно
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Добавляем класс для открытия
        modal.classList.add('active');

        // Блокируем прокрутку body
        document.body.style.overflow = 'hidden';

        // Диспатчим кастомное событие
        const event = new CustomEvent('modal:open', {
          detail: { modalId: modalId },
          bubbles: true
        });
        modal.dispatchEvent(event);
      }

      goToSupportCalculator() {
        const calculation = this.getCalculation();

        // Сохранить данные для калькулятора поддержки
        try {
          sessionStorage.setItem('kartechWidgetData', JSON.stringify(calculation));
          sessionStorage.setItem('kartechWidgetTimestamp', new Date().toISOString());
        } catch (e) {
          console.warn('Не удалось сохранить данные виджета:', e);
        }

        // Перенаправить на страницу калькулятора
        window.location.href = 'calculator.html?source=widget&calculation=' +
          encodeURIComponent(JSON.stringify(calculation));
      }

      // Валидация
      validateCurrentStep() {
        let isValid = false;

        switch (this.state.currentStep) {
          case 1: // Выбор задачи
            isValid = this.state.selectedTask !== '';
            if (this.state.selectedTask === 'other') {
              isValid = this.elements.otherText &&
                this.elements.otherText.value.trim().length > 0;
            }
            break;

          case 2: // Выбор сложности
            isValid = this.state.selectedComplexity !== '' &&
              this.state.selectedHours > 0;
            break;

          case 3: // Выбор специалиста
            isValid = this.state.selectedLevel !== '';
            break;

          case 4: // Результат
            isValid = this.state.selectedTask !== '' &&
              this.state.selectedComplexity !== '' &&
              this.state.selectedLevel !== '';
            break;
        }

        this.state.isValid = isValid;
        this.updateButtons();
        return isValid;
      }

      showError(message) {
        if (!this.elements.errorContainer) return;

        // Очищаем предыдущий таймаут
        if (this.errorTimeout) {
          clearTimeout(this.errorTimeout);
        }

        // Показываем сообщение
        this.elements.errorContainer.textContent = message;
        this.elements.errorContainer.style.display = 'block';
        this.elements.errorContainer.className = 'widget-error error';

        // Анимация появления
        setTimeout(() => {
          this.elements.errorContainer.style.opacity = '1';
          this.elements.errorContainer.style.transform = 'translateY(0)';
        }, 10);

        // Автоматическое скрытие через 5 секунд
        this.errorTimeout = setTimeout(() => {
          this.hideError();
        }, 5000);
      }

      showMessage(message, type = 'info') {
        if (!this.elements.errorContainer) return;

        this.elements.errorContainer.innerHTML = message;
        this.elements.errorContainer.style.display = 'block';
        this.elements.errorContainer.className = `widget-error ${type}`;

        setTimeout(() => {
          this.elements.errorContainer.style.opacity = '1';
          this.elements.errorContainer.style.transform = 'translateY(0)';
        }, 10);

        // Скрыть через 3 секунды
        setTimeout(() => {
          this.hideError();
        }, 3000);
      }

      hideError() {
        if (!this.elements.errorContainer) return;

        this.elements.errorContainer.style.opacity = '0';
        this.elements.errorContainer.style.transform = 'translateY(-10px)';

        setTimeout(() => {
          this.elements.errorContainer.style.display = 'none';
        }, 300);
      }

      // Вспомогательные методы
      updateUI() {
        this.updateProgress();
        this.updateButtons();
        this.updateComplexitySelection();
        this.updateSpecialistSelection();
      }

      updateProgress() {
        if (!this.elements.progressSteps) return;

        this.elements.progressSteps.forEach((step, index) => {
          const isActive = index + 1 === this.state.currentStep;
          if (isActive) {
            step.classList.add('active');
          } else {
            step.classList.remove('active');
          }
        });
      }

      updateButtons() {
        if (!this.elements.prevBtn || !this.elements.nextBtn) return;

        // Кнопка "Назад"
        this.elements.prevBtn.disabled = this.state.currentStep === 1;

        // Кнопка "Далее" - активна только если текущий шаг валиден
        if (this.state.currentStep === 4) {
          this.elements.nextBtn.style.display = 'none';
        } else {
          this.elements.nextBtn.style.display = 'flex';
          this.elements.nextBtn.disabled = !this.state.isValid;

          // Меняем текст на последнем шаге
          if (this.state.currentStep === 3) {
            this.elements.nextBtn.innerHTML = 'Рассчитать <i class="fas fa-calculator"></i>';
          } else {
            this.elements.nextBtn.innerHTML = 'Далее <i class="fas fa-arrow-right"></i>';
          }
        }
      }

      updateComplexitySelection() {
        if (!this.elements.complexityOptions) return;

        this.elements.complexityOptions.forEach(btn => {
          const isActive = btn.dataset.level === this.state.selectedComplexity;
          if (isActive) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      updateSpecialistSelection() {
        if (!this.elements.specialistOptions) return;

        this.elements.specialistOptions.forEach(option => {
          const isActive = option.dataset.level === this.state.selectedLevel;
          if (isActive) {
            option.classList.add('active');
          } else {
            option.classList.remove('active');
          }
        });
      }

      updatePrices() {
        if (!this.elements.resultHours ||
          !this.elements.priceJunior ||
          !this.elements.priceMiddle ||
          !this.elements.priceSenior) {
          return;
        }

        const rates = {
          junior: this.config.juniorRate,
          middle: this.config.middleRate,
          senior: this.config.seniorRate
        };

        const priceJunior = rates.junior * this.state.selectedHours;
        const priceMiddle = rates.middle * this.state.selectedHours;
        const priceSenior = rates.senior * this.state.selectedHours;

        this.elements.resultHours.textContent = this.state.selectedHours;
        this.elements.priceJunior.textContent = this.formatPrice(priceJunior);
        this.elements.priceMiddle.textContent = this.formatPrice(priceMiddle);
        this.elements.priceSenior.textContent = this.formatPrice(priceSenior);
      }

      resetToFirstStep() {
        // Сброс состояния
        this.state = {
          currentStep: 1,
          selectedTask: '',
          selectedComplexity: '',
          selectedHours: 4,
          selectedLevel: '',
          isValid: false
        };

        // Сброс UI
        this.elements.steps.forEach((step, index) => {
          if (index === 0) {
            step.classList.add('active');
          } else {
            step.classList.remove('active');
          }
        });

        // Сброс выбранных опций
        this.elements.taskOptions.forEach(b => b.classList.remove('active'));
        this.elements.complexityOptions.forEach(b => b.classList.remove('active'));
        this.elements.specialistOptions.forEach(o => o.classList.remove('active'));

        // Сброс полей
        if (this.elements.hoursInput) {
          this.elements.hoursInput.value = this.state.selectedHours;
        }

        if (this.elements.otherText) {
          this.elements.otherText.style.display = 'none';
          this.elements.otherText.value = '';
        }

        // Сброс прогресса
        this.updateUI();
        this.hideError();
      }

      formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
      }

      formatFormMessage(calculation) {
        const taskNames = {
          bug: 'Исправление ошибки/бага',
          feature: 'Доработка функционала',
          consult: 'Консультация/аудит',
          other: calculation.taskDescription || 'Другая задача'
        };

        const complexityNames = {
          junior: 'Простая (1-2 часа)',
          middle: 'Средняя (3-8 часов)',
          senior: 'Сложная (8+ часов)'
        };

        const specialistNames = {
          junior: 'Начальный специалист',
          middle: 'Средний специалист',
          senior: 'Специалист высшей категории'
        };

        return `
Расчет выполнен в виджете "Какой специалист вам нужен?"

ТИП ЗАДАЧИ: ${taskNames[calculation.task] || calculation.task}
СЛОЖНОСТЬ: ${complexityNames[calculation.complexity]}
ПРЕДПОЛАГАЕМОЕ ВРЕМЯ: ${calculation.hours} часов
РЕКОМЕНДОВАННЫЙ СПЕЦИАЛИСТ: ${specialistNames[calculation.level]}
СТОИМОСТЬ РАБОТЫ: ${calculation.formattedTotal}

Дополнительные пожелания:
[Здесь можно добавить дополнительные детали]
    `.trim();
      }

      saveToSessionStorage(calculation) {
        try {
          sessionStorage.setItem('kartech_calculation', JSON.stringify(calculation));
        } catch (e) {
          console.warn('Не удалось сохранить расчет в sessionStorage:', e);
        }
      }

      // Публичные методы
      getCalculation() {
        const rates = {
          junior: this.config.juniorRate,
          middle: this.config.middleRate,
          senior: this.config.seniorRate
        };

        // Получаем описание задачи
        let taskDescription = '';
        if (this.state.selectedTask === 'other' && this.elements.otherText) {
          taskDescription = this.elements.otherText.value.trim();
        }

        return {
          task: this.state.selectedTask,
          taskDescription: taskDescription,
          complexity: this.state.selectedComplexity,
          hours: this.state.selectedHours,
          level: this.state.selectedLevel,
          rate: rates[this.state.selectedLevel] || 0,
          total: rates[this.state.selectedLevel] * this.state.selectedHours,
          formattedTotal: this.formatPrice(rates[this.state.selectedLevel] * this.state.selectedHours),
          timestamp: new Date().toISOString()
        };
      }

      setRates(junior, middle, senior) {
        this.config.juniorRate = junior || this.config.juniorRate;
        this.config.middleRate = middle || this.config.middleRate;
        this.config.seniorRate = senior || this.config.seniorRate;

        if (this.state.currentStep === 4) {
          this.updatePrices();
        }

        return this;
      }

      destroy() {
        // Очистка таймаутов
        if (this.errorTimeout) {
          clearTimeout(this.errorTimeout);
        }

        // Удаление элемента
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }
    }
