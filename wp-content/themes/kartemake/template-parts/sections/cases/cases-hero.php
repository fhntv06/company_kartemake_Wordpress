<?php
$cases_count = (int) wp_count_posts('cases')->publish;
?>

<section class="scene scene-hero cases-hero" data-scene="hero" data-canvas-engine>
    <canvas id="heroCanvas" class="hero-canvas" aria-hidden="true"></canvas>

    <div class="scene-container">
        <div class="breadcrumbs">
            <a href="<?= home_url('/') ?>">Главная</a>
            <span class="breadcrumbs__separator">/</span>
            <span class="breadcrumbs__current">Кейсы</span>
        </div>

        <div class="hero-content">
            <div class="system-label">
                K·ART·MAKE / КЕЙСЫ
            </div>
            <h1>Кейсы: технические <span>решения.</span></h1>
            <p>
                Реальные проекты, задачи и технические решения: от аудита и оптимизации до разработки, модернизации и технической поддержки.
            </p>
            <div class="hero-note">
                AUDIT · OPTIMIZATION · MODERNIZATION · DEVELOPMENT · SUPPORT
            </div>
            <div class="hero-meta">
              <span>projects</span>
              <span><strong><?= esc_html($cases_count); ?></strong></span>
            </div>
        </div>
    </div>
</section>
