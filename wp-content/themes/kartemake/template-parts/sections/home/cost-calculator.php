<section class="scene pricing-calculator" data-scene="cost-calculator" data-cost-calculator data-mode="scene">
  <div class="scene-container">
    <!-- SCENE HEADER -->
    <header class="scene-header monitoring-header reveal-item">
      <span class="scene-eyebrow">ЭТАП 07 / Калькулятор стоимости</span>

      <h2 class="scene-title">
        Рассчитайте свою цену без мишуры
      </h2>

      <p class="scene-description">
        Сделайте расчет в зависимости от того, что Вам нужно.
        Ничего лишнего, только нужное.
      </p>
    </header>

    <div class="cost-calculator reveal-item" data-calculator-root>
      <div class="cost-calculator__stage" data-calculator-stage>
        <div class="cost-calculator__orbit" aria-hidden="true"></div>
        <svg class="cost-calculator__flows" data-calculator-flows preserveAspectRatio="none" aria-hidden="true"></svg>
        <div class="cost-calculator__services">
          <button type="button" class="cost-service cost-service--diagnostics" data-cost-service="diagnostics" data-title="Диагностика" data-price="15000">
              <span class="cost-service__index">
                  01 / DIAGNOSTICS
              </span>
            <span class="cost-service__title" data-service-title>
                Понять проблему
              </span>
            <span class="cost-service__price">
                от 15 000 ₽
            </span>
          </button>
          <button type="button" class="cost-service cost-service--audit" data-cost-service="audit" data-title="Технический аудит" data-price="30000">
              <span class="cost-service__index">
                02 / AUDIT
              </span>
            <span class="cost-service__title" data-service-title>
                Оценить состояние
              </span>
            <span class="cost-service__price">
                от 30 000 ₽
              </span>
          </button>
          <button type="button" class="cost-service cost-service--optimization" data-cost-service="optimization" data-title="Оптимизация" data-price="35000">
              <span class="cost-service__index">
                03 / OPTIMIZATION
              </span>
            <span class="cost-service__title" data-service-title>
                Улучшить систему
              </span>
            <span class="cost-service__price">
                от 35 000 ₽
              </span>
          </button>
          <button type="button" class="cost-service cost-service--modernization" data-cost-service="modernization" data-title="Модернизация" data-price="50000">
              <span class="cost-service__index">
                04 / MODERNIZATION
              </span>
            <span class="cost-service__title" data-service-title>
                Изменить основу
              </span>
            <span class="cost-service__price">
                от 50 000 ₽
              </span>
          </button>
          <button type="button" class="cost-service cost-service--support" data-cost-service="support" data-title="Техническая поддержка" data-price="25000">
              <span class="cost-service__index">
                05 / SUPPORT
              </span>
            <span class="cost-service__title" data-service-title>
                Постоянная команда
              </span>
            <span class="cost-service__price">
                от 25 000 ₽ / МЕС
              </span>
          </button>
        </div>
        <!-- CENTER -->
        <div class="cost-calculator__center" data-calculator-center>
            <span class="cost-calculator__center-label">
                текущая конфигурация
            </span>
          <h4 class="cost-calculator__center-price" data-calculator-price>
            0
          </h4>
          <span class="cost-calculator__center-currency">
              ₽
            </span>
          <span class="cost-calculator__center-meta" data-calculator-meta>
              0 услуг выбрано
            </span>
        </div>
        <div class="cost-calculator__actions" data-calculator-actions>
          <button type="button" class="button-primary" data-calculator-next disabled>
            Далее →
          </button>
        </div>
      </div>
      <!-- RESULT -->
      <div class="cost-calculator__result" data-calculator-result>
        <div class="cost-calculator__result-inner">
            <span class="cost-calculator__result-label">
                настройка завершена
            </span>
          <div class="cost-calculator__result-price" data-calculator-result-price>
            0 ₽
          </div>
          <ul class="cost-calculator__result-services" data-calculator-result-services></ul>
          <div class="cost-calculator__actions">
            <button type="button" class="button-primary" data-calculator-back>
              ← Назад
            </button>
            <button type="button" class="button-primary" data-modal-func="open">
              Обсудить задачу →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
