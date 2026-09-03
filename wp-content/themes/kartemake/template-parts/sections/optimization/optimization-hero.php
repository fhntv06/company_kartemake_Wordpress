<section class="scene scene-hero " data-scene="hero" data-canvas-engine>
    <canvas id="heroCanvas" class="hero-canvas" aria-hidden="true"></canvas>
    <div class="scene-container">
        <div class="optimization-hero__inner">
            <div class="hero-content">
                <div class="system-label">K·ART·MAKE / OPTIMIZATION</div>
                <h1>Система может<br><span>работать лучше.</span></h1>
                <p>Находим технические узкие места, устраняем лишнюю нагрузку и повышаем эффективность цифровой инфраструктуры — без необоснованной переделки всей системы.</p>
                <div class="hero-actions">
                    <a href="<?= get_permalink(get_page_by_path('contacts')) ?>" class="button-primary">НАЙТИ УЗКИЕ МЕСТА</a>
                    <a href="#optimization-process" class="button-secondary">КАК ЭТО РАБОТАЕТ</a>
                </div>
            </div>
            <div class="optimization-system">
                <div class="optimization-system__header">
                    <span>SYSTEM / PERFORMANCE</span>
                    <span class="optimization-system__live">
                            <i></i> LIVE
                        </span>
                </div>
                <div class="optimization-system__metrics">
                    <div class="optimization-system__metric">
                        <span class="optimization-system__metric-label">RESPONSE</span>
                        <strong class="optimization-system__metric-value" data-metric="response">842</strong>
                        <span class="optimization-system__metric-unit">ms</span>
                    </div>
                    <div class="optimization-system__metric">
                        <span class="optimization-system__metric-label">SERVER LOAD</span>
                        <strong class="optimization-system__metric-value" data-metric="load">68</strong>
                        <span class="optimization-system__metric-unit">%</span>
                    </div>
                    <div class="optimization-system__metric">
                        <span class="optimization-system__metric-label">DB QUERIES</span>
                        <strong class="optimization-system__metric-value" data-metric="queries">147</strong>
                        <span class="optimization-system__metric-unit">/ req</span>
                    </div>
                    <div class="optimization-system__metric">
                        <span class="optimization-system__metric-label">ERRORS</span>
                        <strong class="optimization-system__metric-value" data-metric="errors">2.4</strong>
                        <span class="optimization-system__metric-unit">%</span>
                    </div>
                </div>
                <div class="optimization-system__chart">
                    <div class="optimization-system__chart-header">
                        <span>PERFORMANCE / 24H</span>
                        <span>PEAK LOAD</span>
                    </div>
                    <div class="optimization-system__chart-grid">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="optimization-system__chart-line">
                        <span></span>
                    </div>
                </div>
                <div class="optimization-system__footer">
                    <span>BOTTLENECKS DETECTED</span>
                    <strong>07</strong>
                </div>
            </div>
        </div>
    </div>

</section>
