<?php
/**
 * Секция: Hero для страницы тега
 *
 * @package KARTEMAKE
 */

$tag              = get_queried_object();
$tag_name         = single_tag_title('', false);
$tag_description  = tag_description();
$posts_page_url   = get_permalink(get_option('page_for_posts'));
?>

<section
    class="scene scene-hero tag-hero"
    data-scene="hero"
    data-canvas-engine
>
    <canvas
        id="heroCanvas"
        class="hero-canvas"
        aria-hidden="true"
    ></canvas>

    <div class="scene-container">
        <div class="breadcrumbs">
            <a href="<?= esc_url(home_url('/')); ?>">
                Главная
            </a>
            <span class="breadcrumbs__separator">/</span>
            <a href="<?= esc_url($posts_page_url); ?>">
                Технический блог
            </a>
            <span class="breadcrumbs__separator">/</span>
            <span class="breadcrumbs__current">
                <?= esc_html($tag_name); ?>
            </span>
        </div>

        <div class="hero-content">
            <div class="system-label">
                K·ART·MAKE / МЕТКА
            </div>

            <h1>
                <?= esc_html($tag_name); ?>
            </h1>

            <?php if ($tag_description) : ?>
                <p><?= wp_kses_post($tag_description); ?></p>
            <?php else : ?>
                <p>
                    Технические материалы K·ART·MAKE по теме
                    «<?= esc_html($tag_name); ?>»: разработка,
                    архитектура, интеграции, производительность
                    и сопровождение digital-продуктов.
                </p>
            <?php endif; ?>

            <div class="hero-note">
                ENGINEERING · DEVELOPMENT · INFRASTRUCTURE · SUPPORT
            </div>

            <div class="hero-meta">
                <span>publications</span>
                <span>
                    <strong><?= esc_html($tag->count); ?></strong>
                </span>
            </div>
        </div>
    </div>
</section>
