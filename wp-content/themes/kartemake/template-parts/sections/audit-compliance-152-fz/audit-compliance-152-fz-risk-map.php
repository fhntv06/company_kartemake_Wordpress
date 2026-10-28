<?php
/**
 * Секция «Аудит сайта по 152-ФЗ»: risk-map.
 * @package KARTEMAKE
 */
?>
<section id="audit-map" class="scene audit-map" data-scene="audit-map">
    <div class="scene-container">
      <header class="scene-header reveal-item">
        <span class="scene-eyebrow">03 / RISK MAP</span>
        <h2 class="scene-title">Где возникают <span>риски</span></h2>
        <p class="scene-description">Проверяем связанные элементы сайта, поскольку проблема часто возникает не в одном документе, а на стыке формы, интеграции и процесса обработки.</p>
      </header>
      <div class="audit-map__content reveal-item">
        <div class="audit-map__nodes">
          <article class="audit-map__node audit-map__node--application reveal-item"><span class="audit-map__node-number">01</span><div><span class="audit-map__node-label">FORMS</span><p>Какие данные посетитель вводит и куда отправляется заявка.</p></div></article>
          <article class="audit-map__node audit-map__node--infrastructure reveal-item"><span class="audit-map__node-number">02</span><div><span class="audit-map__node-label">CONSENTS</span><p>Как оформлены согласия и можно ли отправить форму без них.</p></div></article>
          <article class="audit-map__node audit-map__node--database reveal-item"><span class="audit-map__node-number">03</span><div><span class="audit-map__node-label">COOKIES</span><p>Какие сторонние сервисы загружаются и когда они активируются.</p></div></article>
          <article class="audit-map__node audit-map__node--security reveal-item"><span class="audit-map__node-number">04</span><div><span class="audit-map__node-label">DOCUMENTS</span><p>Соответствуют ли опубликованные документы фактической работе сайта.</p></div></article>
          <article class="audit-map__node audit-map__node--integrations reveal-item"><span class="audit-map__node-number">05</span><div><span class="audit-map__node-label">DATA FLOWS</span><p>Какие данные передаются почте, CRM, аналитике и другим сервисам.</p></div></article>
          <article class="audit-map__node audit-map__node--performance reveal-item"><span class="audit-map__node-number">06</span><div><span class="audit-map__node-label">OPERATOR</span><p>Какая организация выступает оператором и какие обязанности применимы.</p></div></article>
        </div>
        <div class="audit-map__core"><div class="audit-map__core-ring"></div><div class="audit-map__core-content"><span class="audit-map__core-label">WEBSITE</span><strong>152-ФЗ</strong><span class="audit-map__core-status">COMPLIANCE REVIEW</span></div></div>
      </div>
    </div>
  </section>
