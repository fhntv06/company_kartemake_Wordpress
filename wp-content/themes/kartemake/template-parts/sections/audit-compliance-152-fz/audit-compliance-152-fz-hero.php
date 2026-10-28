<?php
/**
 * Секция «Аудит сайта по 152-ФЗ»: hero.
 * @package KARTEMAKE
 */
?>
<section class="scene scene-hero" data-scene="hero" data-canvas-engine>
    <canvas id="heroCanvas" class="hero-canvas" aria-hidden="true"></canvas>
    <div class="scene-container">
      <div class="audit-hero__content reveal-item">
        <div class="hero-content">
          <div class="system-label">K·ART·MAKE / 152-ФЗ</div>
          <h1>Аудит сайта<br><span>на соответствие 152-ФЗ</span></h1>
          <p>Проверяем, как сайт собирает и передаёт персональные данные: формы, согласия, cookie, сторонние сервисы и документы.</p>
          <div class="hero-actions">
            <a href="<?php echo esc_url(get_permalink(get_page_by_path('contacts'))); ?>" class="button-primary">ОБСУДИТЬ АУДИТ</a>
            <a href="#audit-map" class="button-secondary">ЧТО ПРОВЕРЯЕМ</a>
          </div>
        </div>
        <div class="audit-dashboard reveal-item">
          <div class="audit-dashboard__header">
    <span class="audit-dashboard__label">
      АУДИТ / 152-ФЗ
    </span>
            <span class="audit-dashboard__status">
      ПРЕДВАРИТЕЛЬНАЯ ОЦЕНКА
    </span>
          </div>

          <div class="audit-dashboard__grid">
            <div class="audit-dashboard__item">
      <span class="audit-dashboard__item-label">
        ПЕРСОНАЛЬНЫЕ ДАННЫЕ
      </span>
              <strong class="audit-dashboard__item-value">
                ПРОВЕРКА
              </strong>
            </div>

            <div class="audit-dashboard__item">
      <span class="audit-dashboard__item-label">
        ДОКУМЕНТАЦИЯ
      </span>
              <strong class="audit-dashboard__item-value">
                АНАЛИЗ
              </strong>
            </div>

            <div class="audit-dashboard__item">
      <span class="audit-dashboard__item-label">
        ЗАЩИТА ДАННЫХ
      </span>
              <strong class="audit-dashboard__item-value">
                ОЦЕНКА
              </strong>
            </div>

            <div class="audit-dashboard__item">
      <span class="audit-dashboard__item-label">
        ТРЕБОВАНИЯ 152-ФЗ
      </span>
              <strong class="audit-dashboard__item-value">
                СВЕРКА
              </strong>
            </div>
          </div>

          <div class="audit-dashboard__progress">
            <div class="audit-dashboard__progress-bar">
              <span></span>
            </div>

            <div class="audit-dashboard__progress-meta">
              <span>АНАЛИЗ СООТВЕТСТВИЯ</span>
              <span>ОЖИДАНИЕ ДАННЫХ</span>
            </div>
          </div>

          <div class="audit-dashboard__footer">
    <span>
      ВЫЯВЛЕННЫЕ НАРУШЕНИЯ
      <strong>—</strong>
    </span>

            <span>
      УРОВЕНЬ РИСКА
      <strong>НЕ ОПРЕДЕЛЁН</strong>
    </span>
          </div>
        </div>
      </div>
    </div>
  </section>
