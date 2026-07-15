<div id="specialistWidget" data-controller="specialist-widget" data-specialist-widget>
    <div class="widget-circle" data-widget-trigger>
        <i class="fas fa-user-tie"></i>
        <div class="widget-pulse"></div>
    </div>
    <div class="widget-modal" data-widget-modal>
        <div class="widget-header">
            <h4>Какой специалист вам нужен?</h4>
            <p>Рассчитайте стоимость задачи за 30 секунд</p>
            <button class="widget-close" data-widget-close>&times;</button>
        </div>
        <div class="widget-steps">
            <div class="widget-step active" data-widget-step>
                <h5>Какая у вас задача?</h5>
                <div class="task-options">
                    <button class="task-option" data-widget-task data-task="bug">Исправление ошибки/бага</button>
                    <button class="task-option active" data-widget-task data-task="feature">Доработка функционала</button>
                    <button class="task-option" data-widget-task data-task="consult">Консультация/аудит</button>
                    <button class="task-option" data-widget-task data-task="other">Другое</button>
                </div>
                <textarea class="task-other" data-widget-other-text placeholder="Опишите вашу задачу..." style="display: none;"></textarea>
            </div>
            <div class="widget-step" data-widget-step>
                <h5>Оцените сложность задачи</h5>
                <div class="complexity-options">
                    <button class="complexity-option" data-widget-complexity data-hours="2" data-level="junior">
                        <span>Простая</span>
                        <small>1-2 часа работы</small>
                    </button>
                    <button class="complexity-option" data-widget-complexity data-hours="5" data-level="middle">
                        <span>Средняя</span>
                        <small>3-8 часов работы</small>
                    </button>
                    <button class="complexity-option" data-widget-complexity data-hours="10" data-level="senior">
                        <span>Сложная</span>
                        <small>8+ часов работы</small>
                    </button>
                </div>
                <div class="hours-input">
                    <label>Или укажите точное количество часов:</label>
                    <input type="number" min="1" max="100" value="4" data-widget-hours>
                </div>
            </div>
            <div class="widget-step" data-widget-step>
                <h5>Рекомендуемый специалист</h5>
                <div class="specialist-options">
                    <div class="specialist-option active" data-widget-specialist data-level="junior">
                        <div class="specialist-header">
                            <h6>Начальный специалист</h6>
                            <span class="specialist-rate">1 500 ₽/час</span>
                        </div>
                        <p>Стажер/младший разработчик. Идеально для простых правок и контент-обновлений.</p>
                    </div>
                    <div class="specialist-option" data-widget-specialist data-level="middle">
                        <div class="specialist-header">
                            <h6>Средний специалист</h6>
                            <span class="specialist-rate">2 500 ₽/час</span>
                        </div>
                        <p>Опытный fullstack-разработчик. Основной исполнитель для доработок и интеграций.</p>
                    </div>
                    <div class="specialist-option" data-widget-specialist data-level="senior">
                        <div class="specialist-header">
                            <h6>Специалист высшей категории</h6>
                            <span class="specialist-rate">3 500 ₽/час</span>
                        </div>
                        <p>Ведущий разработчик/архитектор. Для сложных задач и оптимизации legacy-кода.</p>
                    </div>
                </div>
            </div>
            <div class="widget-step" data-widget-step>
                <div class="calculation-result">
                    <h5>Расчет для задачи на <span data-widget-result-hours>4</span> часа</h5>
                    <div class="price-comparison">
                        <div class="price-item junior">
                            <div class="price-label">Начальный специалист</div>
                            <div class="price-value" data-widget-price-junior>6 000 ₽</div>
                        </div>
                        <div class="price-item middle">
                            <div class="price-label">Средний специалист</div>
                            <div class="price-value" data-widget-price-middle>10 000 ₽</div>
                        </div>
                        <div class="price-item senior">
                            <div class="price-label">Специалист высшей категории</div>
                            <div class="price-value" data-widget-price-senior>14 000 ₽</div>
                        </div>
                    </div>
                    <div class="widget-note">
                        <i class="fas fa-info-circle"></i>
                        <strong>Важно:</strong> Вы получаете не одного человека, а поддержку всей команды KARTEMAKE. Это включает контроль качества, менеджмент проекта и гарантию результата.
                    </div>
                    <div class="widget-cta">
                        <button class="btn-primary" data-widget-discuss>
                            <i class="fas fa-comments"></i> Обсудить с менеджером
                        </button>
                        <button class="btn-outline" data-widget-support>
                            <i class="fas fa-calculator"></i> Рассчитать абонентскую плату
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="widget-footer">
            <button class="btn-prev" data-widget-prev disabled>
                <i class="fas fa-arrow-left"></i> Назад
            </button>
            <div class="widget-progress">
                <div class="progress-step active" data-widget-progress-step></div>
                <div class="progress-step" data-widget-progress-step></div>
                <div class="progress-step" data-widget-progress-step></div>
                <div class="progress-step" data-widget-progress-step></div>
            </div>
            <button class="btn-next" data-widget-next>
                Далее <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    </div>
</div>
