<?php
/**
 * Секция: CATEGORY HERO
 *
 * @package KARTMAKE
 */

$term        = get_queried_object();
$term_name   = $term instanceof WP_Term ? $term->name : '';
$term_desc   = $term instanceof WP_Term ? $term->description : '';
$posts_count = $term instanceof WP_Term ? (int) $term->count : 0;

$blog_page      = get_page_by_path('blog');
$blog_url       = esc_url($blog_page ? get_permalink($blog_page) : home_url('/blog/'));
$front_page_url = esc_url(home_url('/'));
?>
<section class="scene scene-hero category-hero" data-scene="category-hero" data-canvas-engine>
    <canvas id="heroCanvas" class="hero-canvas" aria-hidden="true"></canvas>

    <div class="scene-container">
        <div class="breadcrumbs">
            <a href="<?= $front_page_url ?>">Главная</a>
            <span class="breadcrumbs__separator">/</span>
            <a href="<?= $blog_url ?>">Технический блог</a>
            <span class="breadcrumbs__separator">/</span>
            <span class="breadcrumbs__current"><?= esc_html($term_name) ?></span>
        </div>

        <div class="hero-content">
            <div class="system-label">K·ART·MAKE / ТЕХНИЧЕСКИЙ БЛОГ</div>
            <h1>Рубрика <span><?= esc_html($term_name) ?></span></h1>
            <?php if ($term_desc) : ?>
                <p><?= esc_html($term_desc) ?></p>
            <?php else : ?>
                <p>Материалы рубрики «<?= esc_html($term_name) ?>»: кейсы, технические разборы и практические решения для бизнеса.</p>
            <?php endif; ?>
            <div class="hero-note">ENGINEERING · INFRASTRUCTURE · DEVELOPMENT · SUPPORT</div>
            <div class="hero-meta">
                <span>publications</span>
                <span><strong><?= esc_html($posts_count) ?></strong></span>
            </div>
        </div>
    </div>
</section>
