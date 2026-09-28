<!-- ======================================================
BLOG HERO
====================================================== -->
<section class="scene scene-hero blog-hero" data-scene="hero" data-canvas-engine>
    <canvas id="heroCanvas" class="hero-canvas" aria-hidden="true"></canvas>
    <div class="scene-container">
        <div class="breadcrumbs">
            <a href="<?= home_url('/') ?>">Главная</a>
            <span class="breadcrumbs__separator">/</span>
            <span class="breadcrumbs__current">Технический блог</span>
        </div>
        <div class="hero-content">
            <div class="system-label">K·ART·MAKE / ТЕХНИЧЕСКИЙ БЛОГ</div>
            <h1>Технический <span>блог.</span></h1>
            <p>Практика разработки, поддержки и развития digital-продуктов: архитектура, интеграции, производительность, инфраструктура и технические решения для бизнеса.</p>
            <div class="hero-note">ENGINEERING · INFRASTRUCTURE · DEVELOPMENT · SUPPORT</div>
            <div class="hero-meta">
                <span>publications</span>
                <span>
                    <strong><?= esc_html(wp_count_posts('post')->publish); ?></strong>
                </span>
          </div>
      </div>
    </div>
</section>
