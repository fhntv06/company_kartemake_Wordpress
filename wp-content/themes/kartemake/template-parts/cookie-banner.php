<div id="cookie-banner" class="cookie-banner" data-controller="cookie">
    <div class="cookie-banner__wrapper">
        <div class="cookie-banner__content">

            <!-- ===== ШАГ 1: ОСНОВНОЙ БАННЕР ===== -->
            <div id="cookie-step-1" class="cookie-step cookie-step--active">
                <div class="cookie-banner__header">
                    <p class="cookie-banner__title font-size-h4">🍪 Мы используем файлы cookie и сервисы веб-аналитики</p>
                </div>
                <p class="cookie-banner__description">
                    для обеспечения работы сайта, анализа посещаемости и улучшения пользовательского опыта.
                </p>
                <div class="cookie-banner__links">
                    <p class="font-size-h5"><b>Подробнее</b>:</p>
                    <p><a href="cookie-policy.html" target="_blank">Политика использования Cookie</a></p>
                    <p><a href="privacy-policy.html" target="_blank">Политика обработки персональных данных</a></p>
                </div>

                <div class="cookie-banner__actions">
                    <button id="cookie-decline" class="button--decline">
                        Отклонить необязательные
                    </button>
                    <button id="cookie-settings-open" class="button--outline">
                        Настроить
                    </button>
                    <button id="cookie-accept" class="button--accent">
                        Принять
                    </button>
                </div>
            </div>

            <!-- ===== ШАГ 2: НАСТРОЙКИ ===== -->
            <div id="cookie-step-2" class="cookie-step">
                <div id="cookie-settings-back" class="cookie-step__back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Назад
                </div>

                <p class="font-size-h4">Настройки cookie</p>
                <p class="cookie-banner__description">Выберите, какие файлы cookie разрешить</p>

                <div class="cookie-settings__body">
                    <!-- Обязательные -->
                    <div class="cookie-settings__group">
                        <div class="cookie-settings__group-header">
                            <span class="font-size-h5">Обязательные cookies</span>
                            <span class="cookie-settings__group-badge"><small>всегда включены</small></span>
                            <label for="cookie-require" class="cookie-settings__toggle cookie-settings__toggle--disabled">
                                <input id="cookie-require" type="checkbox" checked disabled>
                                <span class="cookie-settings__toggle-slider"></span>
                            </label>
                        </div>
                        <small class="cookie-settings__group-description">
                            Эти файлы необходимы для корректной работы сайта. Обеспечивают базовую функциональность, безопасность и доступность.
                        </small>
                    </div>

                    <!-- Аналитические -->
                    <div class="cookie-settings__group">
                        <div class="cookie-settings__group-header">
                            <span class="font-size-h5">Аналитические cookies</span>
                            <span class="cookie-settings__group-badge"><small>опционально</small></span>
                            <label for="analytics-cookies" class="cookie-settings__toggle">
                                <input id="analytics-cookies" type="checkbox">
                                <span class="cookie-settings__toggle-slider"></span>
                            </label>
                        </div>
                        <small class="cookie-settings__group-description">
                            Помогают анализировать, как посетители используют сайт, чтобы улучшать его работу. Данные собираются анонимно через Яндекс.Метрику.
                        </small>
                    </div>
                </div>

                <div class="cookie-settings__footer">
                    <button id="cookie-settings-save" class="button--accent">
                        Сохранить настройки
                    </button>
                </div>
            </div>

        </div>
    </div>
</div>
