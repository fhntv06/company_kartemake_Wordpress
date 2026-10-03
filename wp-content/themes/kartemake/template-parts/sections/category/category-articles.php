<?php
/**
 * Секция: CATEGORY ARTICLES
 *
 * @package KARTMAKE
 */

$term      = get_queried_object();
$term_id   = $term instanceof WP_Term ? $term->term_id : 0;
$term_name = $term instanceof WP_Term ? $term->name : '';

$all_categories = get_categories([
    'hide_empty' => true,
    'orderby'    => 'name',
    'order'      => 'ASC',
]);
?>
<section class="scene card-articles category-articles" data-scene="category-articles" data-filter-cards>
    <div class="scene-container">
        <header class="scene-header reveal-item">
            <div class="scene-eyebrow">АРХИВ / <?= esc_html(mb_strtoupper($term_name)) ?></div>
            <h2 class="scene-title"><?= esc_html($term_name) ?> <span>без теории</span></h2>
            <p class="scene-description">Реальные кейсы, технические разборы и решения задач, с которыми сталкивается бизнес в цифровой среде.</p>
        </header>

        <!-- =================================================
        FILTER
        ================================================== -->
        <div class="filter reveal-item" role="navigation" aria-label="Фильтр рубрик">
            <button class="filter__item is-active" type="button" data-filter="all" aria-pressed="true">
                Все
            </button>
            <?php foreach ($all_categories as $cat) : ?>
                <button
                    class="filter__item<?= ($cat->term_id === $term_id) ? ' is-active' : '' ?>"
                    type="button"
                    data-filter="<?= esc_attr($cat->slug) ?>"
                    aria-pressed="<?= ($cat->term_id === $term_id) ? 'true' : 'false' ?>"
                >
                    <?= esc_html($cat->name) ?>
                </button>
            <?php endforeach; ?>
        </div>

        <!-- ============================================================
        REGULAR ARTICLES
        ============================================================ -->
        <div class="card-articles-grid reveal-item" data-filter-grid>

            <?php if (have_posts()) : ?>
                <?php
                $number = 1;
                while (have_posts()) :
                    the_post();
                    $post_id           = get_the_ID();
                    $post_thumbnail_id = get_post_thumbnail_id($post_id);
                    $post_tags         = get_the_tags($post_id);
                    $categories        = get_the_category($post_id);
                    $category_name     = $categories ? $categories[0]->name : 'ARTICLE';
                    $category_slug     = $categories ? $categories[0]->slug : 'article';
                    ?>
                    <article class="card-article" data-filter-type="<?= esc_attr($category_slug) ?>" data-case-index="<?= esc_attr($number) ?>">
                        <span class="card-article__number"><?= esc_html(str_pad($number, 2, '0', STR_PAD_LEFT)) ?></span>

                        <div class="card-article__image">
                            <span class="card-article__type"><?= esc_html(mb_strtoupper($category_name)) ?></span>
                            <?php if ($post_thumbnail_id) : ?>
                                <?= wp_get_attachment_image($post_thumbnail_id, 'large', false, ['loading' => 'lazy']) ?>
                            <?php endif ?>
                        </div>

                        <div class="card-article__content">
                            <div class="card-article__meta">
                                <span class="card-article__meta-item"><?= esc_html(mb_strtoupper($category_name)) ?></span>
                                <span class="card-article__meta-item"><?= esc_html(get_the_date('d M Y')) ?></span>
                            </div>

                            <h4 class="card-article__title">
                                <a href="<?php the_permalink() ?>"><?php the_title() ?></a>
                            </h4>

                            <p class="card-article__description">
                                <?= esc_html(get_the_excerpt()) ?>
                            </p>

                            <?php if ($post_tags) : ?>
                                <div class="card-article__tags">
                                    <?php foreach ($post_tags as $post_tag) : ?>
                                        <a href="<?= esc_url(get_tag_link($post_tag->term_id)) ?>" class="card-article__tag">
                                            <?= esc_html($post_tag->name) ?>
                                        </a>
                                    <?php endforeach ?>
                                </div>
                            <?php endif ?>

                            <a href="<?php the_permalink() ?>" class="card-article__link">
                                <p>Читать кейс</p>
                                <span class="card-article__link-arrow">↗</span>
                            </a>
                        </div>
                    </article>
                    <?php
                    $number++;
                endwhile;
                ?>
            <?php else : ?>
                <div class="tag-empty reveal-item">
                    <span class="system-label">NO PUBLICATIONS</span>
                    <h3>Материалов пока нет.</h3>
                    <p>Посты не опубликованы</p>
                    <a href="<?= home_url('/'); ?>" class="button-primary">
                      На страницу кейсов
                    </a>
                </div>
            <?php endif; ?>
        </div>

        <!-- =================================================
        PAGINATION
        ================================================== -->
        <nav class="pagination" data-filter-pagination aria-label="Пагинация кейсов"></nav>

        <!-- ============================================================
        CTA BLOCK
        ============================================================ -->
        <div class="cta-block reveal-item">
            <span>TECHNICAL PARTNER / K·ART·MAKE</span>
            <h5 class="cta-block__title">Есть техническая задача?</h5>
            <p class="cta-block__text">Опишите проблему, проект или задачу. Мы разберём техническую часть и предложим оптимальный способ решения.</p>
            <button class="button-primary" type="button" data-modal-func="open">Обсудить задачу</button>
        </div>
    </div>
</section>
