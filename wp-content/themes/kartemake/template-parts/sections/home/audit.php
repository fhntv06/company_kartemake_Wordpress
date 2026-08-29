<section class="scene scene-audit" data-scene="audit">
    <div class="scene-container">

        <?php get_template_part('template-parts/components/scene-header', null, array(
            'eyebrow' => 'ЭТАП 02 / ДИАГНОСТИКА',
            'title' => 'Сначала разбираемся,<br>что мешает вашему сайту работать лучше',
            'description' => 'Проверяем сайт и инфраструктуру целиком: производительность, ошибки, безопасность, адаптивность, код и серверное окружение. Вы получаете понятный отчёт о проблемах и приоритетный план их устранения.'
        )); ?>

        <!-- TERMINAL -->
        <div class="audit-terminal terminal reveal-item">
            <div class="terminal-header">
                <span>ТЕХНИЧЕСКАЯ ДИАГНОСТИКА</span>
                <span class="terminal-status">ВЫПОЛНЯЕТСЯ</span>
            </div>
            <div class="terminal-body"></div>
        </div>

        <div class="audit-content reveal-item">

            <!-- METRICS -->
            <div class="audit-metrics">
                <article class="audit-metric reveal-item">
                    <span class="metric-label">ПРОИЗВОДИТЕЛЬНОСТЬ</span>
                    <strong class="metric-value">SPEED</strong>
                    <p>Скорость загрузки, Core Web Vitals, тяжёлые ресурсы и узкие места.</p>
                </article>

                <article class="audit-metric reveal-item">
                    <span class="metric-label">НАДЁЖНОСТЬ</span>
                    <strong class="metric-value">STABLE</strong>
                    <p>Ошибки, сбои, обновления, сервер и состояние инфраструктуры.</p>
                </article>

                <article class="audit-metric reveal-item">
                    <span class="metric-label">КАЧЕСТВО</span>
                    <strong class="metric-value">READY</strong>
                    <p>Адаптивность, браузеры, технические ошибки и корректность работы.</p>
                </article>
            </div>

            <!-- CHECKS -->
            <div class="audit-checks">
                <article class="audit-check reveal-item">
                    <h5>Сайт и страницы</h5>
                    <span>Проверено</span>
                </article>
                <article class="audit-check reveal-item">
                    <h5>Код и интеграции</h5>
                    <span>Проверено</span>
                </article>
                <article class="audit-check reveal-item">
                    <h5>Сервер и инфраструктура</h5>
                    <span>Проверено</span>
                </article>
            </div>

            <!-- RESULT -->
            <div class="audit-result reveal-item">
                <div class="result-score">
                    <strong>→</strong>
                </div>
                <div>
                    <h5>Что вы получите</h5>
                    <p>Понимание текущего состояния сайта, список проблем с приоритетами и конкретный план технических работ.</p>
                </div>
            </div>

        </div>
    </div>
</section>