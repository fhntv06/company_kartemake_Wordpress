<section id="calculator" class="scene calculator" data-scene="calculator-scene" data-calculator>
    <div class="scene-container">
        <!-- ====================================================
        HEADER
        ==================================================== -->
        <header class="scene-header">
            <div class="scene-eyebrow">PROJECT CALCULATOR</div>
            <h2 class="scene-title">Рассчитайте стоимость <span>технических работ.</span></h2>
            <p class="scene-description">Опишите задачу, выберите необходимые параметры и получите предварительную оценку технических работ.</p>
        </header>
        <!-- ====================================================
             STEPS
             ==================================================== -->
        <nav id="calculator-steps" class="calculator-steps" aria-label="Этапы расчёта">
            <button type="button" class="calculator-steps__item is-active" data-calculator-nav="options" aria-current="step">
                <span class="calculator-steps__number">01</span>
                <span class="calculator-steps__content">
                    <span class="calculator-steps__title">Конфигурация</span>
                    <span class="calculator-steps__status">Параметры задачи</span>
                </span>
            </button>
            <button type="button" class="calculator-steps__item" data-calculator-nav="builder" disabled>
                <span class="calculator-steps__number">02</span>
                <span class="calculator-steps__content">
                    <span class="calculator-steps__title">Состав работ</span>
                    <span class="calculator-steps__status">Техническая конфигурация</span>
                </span>
            </button>
            <button type="button" class="calculator-steps__item" data-calculator-nav="result" disabled>
                <span class="calculator-steps__number">03</span>
                <span class="calculator-steps__content">
                    <span class="calculator-steps__title">Результат</span>
                    <span class="calculator-steps__status">Предварительная оценка</span>
                </span>
            </button>
        </nav>
        <!-- ====================================================
             CONTENT
             ==================================================== -->
        <div class="calculator__content">
            <!-- =================================================
                 OPTIONS
                 ================================================= -->
            <section class="calculator__step calculator-options is-active" data-calculator-step="options">
                <div class="calculator-options__layout">
                    <div class="calculator-panel">
                        <!-- PANEL HEADER -->
                        <header class="calculator-panel__header">
                            <div>
                                <span class="calculator-panel__label">CONFIG / TASK</span>
                                <h5 class="calculator-panel__title">Что необходимо сделать?</h5>
                            </div>
                            <span class="calculator-panel__counter">01 / 03</span>
                        </header>
                        <!-- =================================================
                             TASK
                             ================================================= -->
                        <div class="calculator-group">
                            <div class="calculator-group__header">
                                <div>
                                    <span class="calculator-group__label">Основная задача</span>
                                    <span class="calculator-group__description">Выберите основное направление технических работ.</span>
                                </div>
                                <span class="calculator-group__status">REQUIRED</span>
                            </div>
                            <div class="calculator-option-grid">
                                <!-- DEVELOPMENT -->
                                <label class="calculator-option" data-calculator-option data-option-group="task" data-value="development" data-price="15000">
                                    <input type="radio" name="calculator_task" value="development">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Разработка</span>
                                    <span class="calculator-option__description">Создание нового цифрового продукта или отдельного функционального модуля.</span>
                                    <span class="calculator-option__price">от <strong>15 000 ₽</strong></span>
                                </label>
                                <!-- SUPPORT -->
                                <label class="calculator-option" data-calculator-option data-option-group="task" data-value="support" data-price="15000">
                                    <input type="radio" name="calculator_task" value="support">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Поддержка</span>
                                    <span class="calculator-option__description">Постоянное техническое сопровождение и решение текущих задач.</span>
                                    <span class="calculator-option__price">от <strong>15 000 ₽ / мес.</strong></span>
                                </label>
                                <!-- OPTIMIZATION -->
                                <label class="calculator-option" data-calculator-option data-option-group="task" data-value="optimization" data-price="15000">
                                    <input type="radio" name="calculator_task" value="optimization">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Оптимизация</span>
                                    <span class="calculator-option__description">Поиск узких мест и повышение производительности системы.</span>
                                    <span class="calculator-option__price">от <strong>15 000 ₽</strong></span>
                                </label>
                                <!-- AUDIT -->
                                <label class="calculator-option" data-calculator-option data-option-group="task" data-value="audit" data-price="15000">
                                    <input type="radio" name="calculator_task" value="audit">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Аудит</span>
                                    <span class="calculator-option__description">Техническое исследование проекта, инфраструктуры и текущих проблем.</span>
                                    <span class="calculator-option__price">от <strong>15 000 ₽</strong></span>
                                </label>
                            </div>
                        </div>
                        <!-- =================================================
                             SCALE
                             ================================================= -->
                        <div class="calculator-group">
                            <div class="calculator-group__header">
                                <div>
                                    <span class="calculator-group__label">Масштаб проекта</span>
                                    <span class="calculator-group__description">Определяет объём и сложность технических работ.</span>
                                </div>
                                <span class="calculator-group__status">REQUIRED</span>
                            </div>
                            <div class="calculator-option-grid">
                                <!-- SMALL -->
                                <label class="calculator-option" data-calculator-option data-option-group="scale" data-value="small" data-multiplier="1">
                                    <input type="radio" name="calculator_scale" value="small">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Небольшой</span>
                                    <span class="calculator-option__description">Сайт, небольшой сервис или отдельный цифровой модуль.</span>
                                    <span class="calculator-option__price">коэффициент <strong>×1.0</strong></span>
                                </label>
                                <!-- MEDIUM -->
                                <label class="calculator-option" data-calculator-option data-option-group="scale" data-value="medium" data-multiplier="1.4">
                                    <input type="radio" name="calculator_scale" value="medium">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Средний</span>
                                    <span class="calculator-option__description">Несколько систем, интеграций или существенный объём технической работы.</span>
                                    <span class="calculator-option__price">коэффициент <strong>×1.4</strong></span>
                                </label>
                                <!-- LARGE -->
                                <label class="calculator-option" data-calculator-option data-option-group="scale" data-value="large" data-multiplier="1.8">
                                    <input type="radio" name="calculator_scale" value="large">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Крупный</span>
                                    <span class="calculator-option__description">Сложная инфраструктура, несколько контуров и большое количество компонентов.</span>
                                    <span class="calculator-option__price">коэффициент <strong>×1.8</strong></span>
                                </label>
                            </div>
                        </div>
                        <!-- =================================================
                             ADDITIONAL
                             ================================================= -->
                        <div class="calculator-group">
                            <div class="calculator-group__header">
                                <div>
                                    <span class="calculator-group__label">Дополнительные работы</span>
                                    <span class="calculator-group__description">Необязательные работы, которые можно добавить к основной конфигурации.</span>
                                </div>
                                <span class="calculator-group__status">OPTIONAL</span>
                            </div>
                            <div class="calculator-option-grid">
                                <!-- INFRASTRUCTURE -->
                                <label class="calculator-option" data-calculator-option data-option-group="additional" data-value="infrastructure" data-price="10000">
                                    <input type="checkbox" name="calculator_additional" value="infrastructure">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Инфраструктура</span>
                                    <span class="calculator-option__description">Настройка сервера, окружения, SSL и базовой инфраструктуры.</span>
                                    <span class="calculator-option__price">+ <strong>10 000 ₽</strong></span>
                                </label>
                                <!-- MONITORING -->
                                <label class="calculator-option" data-calculator-option data-option-group="additional" data-value="monitoring" data-price="8000">
                                    <input type="checkbox" name="calculator_additional" value="monitoring">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Мониторинг</span>
                                    <span class="calculator-option__description">Контроль доступности, ошибок и состояния технической системы.</span>
                                    <span class="calculator-option__price">+ <strong>8 000 ₽</strong></span>
                                </label>
                                <!-- DOCUMENTATION -->
                                <label class="calculator-option" data-calculator-option data-option-group="additional" data-value="documentation" data-price="5000">
                                    <input type="checkbox" name="calculator_additional" value="documentation">
                                    <span class="calculator-option__indicator"></span>
                                    <span class="calculator-option__title">Документация</span>
                                    <span class="calculator-option__description">Фиксация архитектуры, настроек и технических решений.</span>
                                    <span class="calculator-option__price">+ <strong>5 000 ₽</strong></span>
                                </label>
                            </div>
                        </div>
                        <!-- FOOTER -->
                        <footer class="calculator-panel__footer">
                            <p class="calculator-panel__hint">Выберите основную задачу и масштаб проекта. Дополнительные работы можно добавить по необходимости.</p>
                            <button type="button" class="button-primary" data-calculator-next="builder">Далее</button>
                        </footer>
                    </div>
                </div>
            </section>
            <!-- =================================================
                 BUILDER
                 ================================================= -->
            <section class="calculator__step calculator-builder" data-calculator-step="builder" hidden>
                <div class="calculator-builder__layout">
                    <div class="calculator-panel">
                        <!-- HEADER -->
                        <header class="calculator-panel__header">
                            <div>
                                <span class="calculator-panel__label">CONFIG / WORK PACKAGE</span>
                                <h5 class="calculator-panel__title">Состав технических работ</h5>
                            </div>
                            <span class="calculator-panel__counter">02 / 03</span>
                        </header>
                        <!-- =================================================
                        WORKS
                        ================================================= -->
                        <div class="calculator-group" data-calculator-work-source="development">
                            <div class="calculator-group__header">
                                <div>
                                    <span class="calculator-group__label">Работы для разработки</span>
                                    <span class="calculator-group__description">Базовый набор технических работ.</span>
                                </div>
                                <span class="calculator-group__status">INCLUDED</span>
                            </div>
                            <div class="calculator-builder-list">
                                <label class="calculator-builder-item" data-calculator-work data-work-id="analysis" data-task="development" data-price="5000">
                                    <input type="checkbox" value="analysis">
                                    <span class="calculator-builder-item__indicator"></span>
                                    <span class="calculator-builder-item__content">
                                        <span class="calculator-builder-item__title">Анализ задачи</span>
                                        <span class="calculator-builder-item__description">Разбор требований, ограничений и технических условий проекта.</span>
                                    </span>
                                    <span class="calculator-builder-item__price">5 000 ₽</span>
                                </label>
                                <label class="calculator-builder-item" data-calculator-work data-work-id="architecture" data-task="development" data-price="10000">
                                    <input type="checkbox" value="architecture">
                                    <span class="calculator-builder-item__indicator"></span>
                                    <span class="calculator-builder-item__content">
                                        <span class="calculator-builder-item__title">Проектирование решения</span>
                                        <span class="calculator-builder-item__description">Определение архитектуры и технического подхода к реализации.</span>
                                    </span>
                                    <span class="calculator-builder-item__price">10 000 ₽</span>
                                </label>
                            </div>
                        </div>
                        <!-- SUPPORT WORKS -->
                        <div class="calculator-group" data-calculator-work-source="support" hidden>
                            <div class="calculator-group__header">
                                <div>
                                    <span class="calculator-group__label">Работы по поддержке</span>
                                    <span class="calculator-group__description">Базовый набор работ по техническому сопровождению.</span>
                                </div>
                                <span class="calculator-group__status">INCLUDED</span>
                            </div>
                            <div class="calculator-builder-list">
                                <label class="calculator-builder-item" data-calculator-work data-work-id="diagnostics" data-task="support" data-price="7000">
                                    <input type="checkbox" value="diagnostics">
                                    <span class="calculator-builder-item__indicator"></span>
                                    <span class="calculator-builder-item__content">
                                        <span class="calculator-builder-item__title">Техническая диагностика</span>
                                        <span class="calculator-builder-item__description">Проверка текущего состояния системы и выявление проблем.</span>
                                    </span>
                                    <span class="calculator-builder-item__price">7 000 ₽</span>
                                </label>
                                <label class="calculator-builder-item" data-calculator-work data-work-id="support" data-task="support" data-price="8000">
                                    <input type="checkbox" value="support">
                                    <span class="calculator-builder-item__indicator"></span>
                                    <span class="calculator-builder-item__content">
                                        <span class="calculator-builder-item__title">Техническое сопровождение</span>
                                        <span class="calculator-builder-item__description">Решение текущих технических задач и сопровождение проекта.</span>
                                    </span>
                                    <span class="calculator-builder-item__price">8 000 ₽</span>
                                </label>
                            </div>
                        </div>
                        <!-- OPTIMIZATION WORKS -->
                        <div class="calculator-group" data-calculator-work-source="optimization" hidden>
                            <div class="calculator-group__header">
                                <div>
                                    <span class="calculator-group__label">Работы по оптимизации</span>
                                    <span class="calculator-group__description">Исследование и устранение технических узких мест.</span>
                                </div>
                                <span class="calculator-group__status">INCLUDED</span>
                            </div>
                            <div class="calculator-builder-list">
                                <label class="calculator-builder-item" data-calculator-work data-work-id="analysis" data-task="optimization" data-price="15000">
                                    <input type="checkbox" value="analysis">
                                    <span class="calculator-builder-item__indicator"></span>
                                    <span class="calculator-builder-item__content">
                                        <span class="calculator-builder-item__title">Анализ текущего состояния</span>
                                        <span class="calculator-builder-item__description">Изучение текущей архитектуры, технического состояния и ограничений проекта.</span>
                                    </span>
                                    <span class="calculator-builder-item__price">15 000 ₽</span>
                                </label>
                                <label class="calculator-builder-item" data-calculator-work data-work-id="architecture" data-task="optimization" data-price="12000">
                                    <input type="checkbox" value="architecture">
                                    <span class="calculator-builder-item__indicator"></span>
                                    <span class="calculator-builder-item__content">
                                        <span class="calculator-builder-item__title">Анализ архитектуры</span>
                                        <span class="calculator-builder-item__description">Проверка связей между компонентами, сервисами и инфраструктурой.</span>
                                    </span>
                                    <span class="calculator-builder-item__price">12 000 ₽</span>
                                </label>
                                <label class="calculator-builder-item" data-calculator-work data-work-id="performance" data-task="optimization" data-price="20000">
                                    <input type="checkbox" value="performance">
                                    <span class="calculator-builder-item__indicator"></span>
                                    <span class="calculator-builder-item__content">
                                        <span class="calculator-builder-item__title">Анализ производительности</span>
                                        <span class="calculator-builder-item__description">Поиск узких мест и причин снижения производительности.</span>
                                    </span>
                                    <span class="calculator-builder-item__price">20 000 ₽</span>
                                </label>
                            </div>
                        </div>
                        <!-- AUDIT WORKS -->
                        <div class="calculator-group" data-calculator-work-source="audit" hidden>
                            <div class="calculator-group__header">
                                <div>
                                    <span class="calculator-group__label">Работы по аудиту</span>
                                    <span class="calculator-group__description">Комплексное техническое исследование проекта.</span>
                                </div>
                                <span class="calculator-group__status">INCLUDED</span>
                            </div>
                            <div class="calculator-builder-list">
                                <label class="calculator-builder-item" data-calculator-work data-work-id="technical-audit" data-task="audit" data-price="15000">
                                    <input type="checkbox" value="technical-audit">
                                    <span class="calculator-builder-item__indicator"></span>
                                    <span class="calculator-builder-item__content">
                                        <span class="calculator-builder-item__title">Технический аудит</span>
                                        <span class="calculator-builder-item__description">Комплексное исследование проекта, инфраструктуры и текущего состояния.</span>
                                    </span>
                                    <span class="calculator-builder-item__price">15 000 ₽</span>
                                </label>
                                <label class="calculator-builder-item" data-calculator-work data-work-id="architecture" data-task="audit" data-price="12000">
                                    <input type="checkbox" value="architecture">
                                    <span class="calculator-builder-item__indicator"></span>
                                    <span class="calculator-builder-item__content">
                                        <span class="calculator-builder-item__title">Анализ архитектуры</span>
                                        <span class="calculator-builder-item__description">Проверка архитектурных решений и взаимосвязей компонентов системы.</span>
                                    </span>
                                    <span class="calculator-builder-item__price">12 000 ₽</span>
                                </label>
                            </div>
                        </div>
                        <!-- OPTIONAL WORKS -->
                        <div class="calculator-group">
                            <div class="calculator-group__header">
                                <div>
                                    <span class="calculator-group__label">Дополнительные работы</span>
                                    <span class="calculator-group__description">Выбранные дополнительные услуги из конфигурации.</span>
                                </div>
                                <span class="calculator-group__status">OPTIONAL</span>
                            </div>
                            <div class="calculator-builder-list" data-calculator-additional-list></div>
                        </div>
                        <!-- FOOTER -->
                        <footer class="calculator-panel__footer">
                            <button type="button" class="button-secondary" data-calculator-back="options">Назад</button>
                            <button type="button" class="button-primary" data-calculator-next="result">Рассчитать стоимость</button>
                        </footer>
                    </div>
                    <!-- LIVE SUMMARY -->
                    <aside class="calculator-summary">
                        <div class="calculator-summary__header">
                            <span class="calculator-summary__label">LIVE ESTIMATE</span>
                            <span class="calculator-summary__status">READY</span>
                        </div>
                        <div class="calculator-summary__total">
                            <span class="calculator-summary__caption">Предварительная стоимость</span>
                            <strong class="calculator-summary__price" data-calculator-total>0 ₽</strong>
                        </div>
                        <div class="calculator-summary__meta">
                            <div class="calculator-summary__meta-item">
                                <span>Работ выбрано</span>
                                <strong data-calculator-count>0</strong>
                            </div>
                            <div class="calculator-summary__meta-item">
                                <span>Масштаб</span>
                                <strong data-calculator-scale>—</strong>
                            </div>
                        </div>
                        <p class="calculator-summary__note">Расчёт предварительный. Финальная стоимость определяется после анализа конкретной задачи и технического состояния проекта.</p>
                    </aside>
                </div>
            </section>
            <!-- =================================================
                 RESULT
                 ================================================= -->
            <section class="calculator__step calculator-result" data-calculator-step="result" hidden>
                <div class="calculator-result__layout">
                    <!-- RESULT PANEL -->
                    <div class="calculator-panel">
                        <!-- HEADER -->
                        <header class="calculator-panel__header">
                            <div>
                                <span class="calculator-panel__label">ESTIMATE / SUMMARY</span>
                                <h5 class="calculator-panel__title">Предварительная стоимость</h5>
                            </div>
                            <span class="calculator-panel__counter">03 / 03</span>
                        </header>
                        <!-- TOTAL -->
                        <div class="calculator-result__total">
                            <span class="calculator-result__caption">Ориентировочная стоимость</span>
                            <strong class="calculator-result__price" data-calculator-result-total>0 ₽</strong>
                            <span class="calculator-result__note">Финальная стоимость определяется после технического анализа задачи.</span>
                        </div>
                        <!-- CONFIGURATION -->
                        <div class="calculator-result__section">
                            <div class="calculator-result__section-header">
                                <span class="calculator-result__section-label">CONFIGURATION</span>
                                <button type="button" class="calculator-result__edit" data-calculator-back="options">Изменить</button>
                            </div>
                            <div class="calculator-result__config">
                                <div class="calculator-result__config-item">
                                    <span>Основная задача</span>
                                    <strong data-calculator-result-task>—</strong>
                                </div>
                                <div class="calculator-result__config-item">
                                    <span>Масштаб</span>
                                    <strong data-calculator-result-scale>—</strong>
                                </div>
                                <div class="calculator-result__config-item">
                                    <span>Работ выбрано</span>
                                    <strong data-calculator-result-count>0</strong>
                                </div>
                            </div>
                        </div>
                        <!-- WORK PACKAGE -->
                        <div class="calculator-result__section">
                            <div class="calculator-result__section-header">
                                <span class="calculator-result__section-label">WORK PACKAGE</span>
                                <button type="button" class="calculator-result__edit" data-calculator-back="builder">Изменить</button>
                            </div>
                            <div class="calculator-result__works" data-calculator-result-works></div>
                        </div>
                    </div>
                    <!-- CTA -->
                    <aside class="calculator-result__aside">
                        <div class="calculator-result__cta">
                            <span class="calculator-result__cta-label">NEXT STEP</span>
                            <h5 class="calculator-result__cta-title">Обсудим задачу?</h5>
                            <p class="calculator-result__cta-description">Отправьте конфигурацию. Мы изучим задачу, уточним технические детали и подготовим точное предложение.</p>
                            <form
                                class="form calculator-result__form"
                                data-form
                                data-calculator-form
                                action="/wp-json/my/v1/lead"
                                method="POST"
                                enctype="multipart/form-data"
                                novalidate
                            >
                                <input type="hidden" name="calculator_task"       value="">
                                <input type="hidden" name="calculator_scale"      value="">
                                <input type="hidden" name="calculator_additional" value="">
                                <input type="hidden" name="calculator_works"      value="">
                                <input type="hidden" name="calculator_total"      value="">

                                <input type="hidden" name="form_source" value="calculator">
                                <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true"
                                   style="position:absolute;left:-9999px;opacity:0;pointer-events:none;">

                                <div class="form__fields">
                                    <div class="form__row">
                                        <div class="form__field calculator-result__field">
                                            <label for="calculator-name">Имя</label>
                                            <input type="text" id="calculator-name" name="name" autocomplete="name"
                                                   placeholder="Как к вам обращаться?" required>
                                          <span class="form__error" data-form-error="name"></span>
                                        </div>

                                        <div class="form__field calculator-result__field">
                                            <label for="calculator-contact">Контакт</label>
                                            <input type="text" id="calculator-contact" name="contact"
                                                   placeholder="Email или телефон" required>
                                            <span class="form__error" data-form-error="contact"></span>
                                        </div>
                                      </div>

                                    <div class="form__field calculator-result__field">
                                        <label for="calculator-message">Комментарий</label>
                                        <textarea id="calculator-message" name="message" rows="3"
                                                placeholder="Кратко опишите задачу"></textarea>
                                        <span class="form__error" data-form-error="message"></span>
                                    </div>

                                    <div class="form__field form__field--files">
                                        <label class="form__file-label" for="calculator-files">
                                          Прикрепить файлы
                                          <span class="form__file-hint">DOC, DOCX, PDF, RTF · до 5 МБ · максимум 3</span>
                                        </label>

                                        <label class="form__dropzone" for="calculator-files" data-form-dropzone>
                                            <input type="file" id="calculator-files" name="files[]" multiple
                                                   accept=".doc,.docx,.pdf,.rtf" data-form-files>
                                            <span class="form__dropzone-icon" aria-hidden="true">↑</span>
                                            <span class="form__dropzone-text">
                                               <strong>Перетащите файлы</strong> или
                                                <span class="form__dropzone-link">выберите на устройстве</span>
                                            </span>
                                        </label>

                                      <ul class="form__file-list" data-form-file-list></ul>
                                      <span class="form__error" data-form-error="files"></span>
                                    </div>

                                    <div class="form__field form__field--checkbox">
                                        <label class="form__checkbox">
                                            <input type="checkbox" name="consent" value="1" required data-form-consent>
                                            <span class="form__checkbox-indicator" aria-hidden="true"></span>
                                            <span class="form__checkbox-text">
                                                Я согласен с
                                                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a>
                                                и даю согласие на
                                                <a href="/personal-data-consent" target="_blank" rel="noopener noreferrer">обработку персональных данных</a>.
                                            </span>
                                        </label>
                                        <span class="form__error" data-form-error="consent"></span>
                                    </div>
                                </div>

                                <div class="form__footer">
                                    <div class="form__actions">
                                        <button type="submit" class="button-primary">Отправить конфигурацию</button>
                                        <span class="form__status" data-form-status aria-live="polite"></span>
                                    </div>
                                </div>
                            </form>
                            <p class="calculator-result__legal">Отправляя форму, вы соглашаетесь с условиями обработки предоставленных данных.</p>
                        </div>
                        <div class="calculator-result__note">
                            <span class="calculator-result__note-label">ENGINEERING NOTE</span>
                            <p>Калькулятор показывает ориентир, а не фиксированную цену. Реальная стоимость зависит от состояния проекта, архитектуры и фактического объёма работ.</p>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    </div>
</section>
