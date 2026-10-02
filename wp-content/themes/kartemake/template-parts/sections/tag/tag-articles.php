<?php
/**
 * Секция: Архив статей тега
 *
 * @package KARTEMAKE
 */

$tag      = get_queried_object();
$tag_name = single_tag_title('', false);

$filter_terms = get_terms([
  'taxonomy'   => 'case_service',
  'hide_empty' => true,
]);
$categories = get_categories([
  'hide_empty' => true,
  'orderby'    => 'name',
  'order'      => 'ASC',
]);
$tag_query = new WP_Query([
    'post_type'      => ['post', 'cases'],
    'post_status'         => 'publish',
    'posts_per_page'      => 50, // грузим сразу максимум
    'paged'               => 1,  // JS-пагинация, серверная не нужна
    'tag_id'              => $tag->term_id,
    'ignore_sticky_posts' => true,
]);
?>

<section class="scene tag-articles" data-scene="articles" data-filter-cards>
    <div class="scene-container">
        <div class="scene-header">
            <div class="scene-eyebrow">
                TAG / ARCHIVE
            </div>
            <h2>
                Материалы по теме
            </h2>
            <p class="scene-description">
                Практические материалы, кейсы и технические
                разборы, связанные с <?= esc_html($tag_name); ?>.
            </p>
        </div>

        <?php if ($tag_query->have_posts()) : ?>
            <!-- FILTER -->
            <div class="filter reveal-item" role="navigation" aria-label="Фильтр кейсов">
              <button class="filter__item is-active" type="button" data-filter="all" aria-pressed="true">Все</button>

              <?php if (!empty($categories) && !is_wp_error($categories)): ?>
                <?php foreach ($categories as $cat): ?>
                  <button class="filter__item"
                          type="button"
                          data-filter="<?= esc_attr($cat->slug); ?>"
                          aria-pressed="false">
                    <?= esc_html($cat->name); ?>
                  </button>
                <?php endforeach; ?>
              <?php endif; ?>
            </div>

            <div class="card-articles-grid reveal-item" data-filter-grid>
                <?php $article_number = 1; ?>
                <?php while ($tag_query->have_posts()) : $tag_query->the_post(); ?>
                    <?php
                    $post_cats = get_the_category();
                    $tags       = get_the_tags();
                    $category   = !empty($categories) ? $categories[0] : null;
                    $reading_time = get_post_meta(get_the_ID(), 'reading_time', true);

                    // Слаги всех рубрик через пробел
                    $cat_slugs = !empty($post_cats)
                      ? implode(' ', wp_list_pluck($post_cats, 'slug'))
                      : 'article';

                    // Названия всех рубрик — для card-article__type
                    $cat_names = !empty($post_cats)
                      ? implode(' / ', wp_list_pluck($post_cats, 'name'))
                      : 'ARTICLE';
                    ?>
                    <article class="card-article"
                         data-filter-type="<?= esc_attr($cat_slugs); ?>"
                         data-case-index="<?= esc_attr($article_number); ?>">

                        <span class="card-article__number">
                            <?= esc_html(str_pad($article_number, 2, '0', STR_PAD_LEFT)); ?>
                        </span>

                        <div class="card-article__image">
                            <span class="card-article__type">
                              <?= esc_html(mb_strtoupper($cat_names)); ?>
                            </span>
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('large', [
                                    'loading' => 'lazy',
                                    'alt'     => esc_attr(get_the_title()),
                                ]); ?>
                            <?php endif; ?>
                        </div>

                        <div class="card-article__content">
                            <div class="card-article__meta">
                                <span class="card-article__meta-item">
                                    <?php if ($reading_time) : ?>
                                        <?= esc_html($reading_time); ?> MIN
                                    <?php else : ?>
                                        —
                                    <?php endif; ?>
                                </span>
                                <span class="card-article__meta-item">
                                    <?= esc_html(get_the_date('d M Y')); ?>
                                </span>
                            </div>

                            <h4 class="card-article__title">
                                <a href="<?= esc_url(get_permalink()); ?>">
                                    <?= esc_html(get_the_title()); ?>
                                </a>
                            </h4>

                            <p class="card-article__description">
                                <?= esc_html(get_the_excerpt()); ?>
                            </p>

                            <?php if (!empty($tags)) : ?>
                                <div class="card-article__tags">
                                    <?php foreach ($tags as $tag_item) : ?>
                                        <a href="<?= esc_url(get_tag_link($tag_item->term_id)); ?>"
                                           class="card-article__tag">
                                            <?= esc_html($tag_item->name); ?>
                                        </a>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>

                            <a href="<?= esc_url(get_permalink()); ?>"
                               class="card-article__link">
                                <p>Читать статью</p>
                                <span class="card-article__link-arrow">↗</span>
                            </a>
                        </div>
                    </article>

                    <?php $article_number++; ?>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>
            </div>

            <nav class="pagination"
                 data-filter-pagination
                 aria-label="Навигация по страницам"></nav>

        <?php else : ?>
            <div class="tag-empty">
                <span class="system-label">NO PUBLICATIONS</span>
                <h3>Материалов пока нет.</h3>
                <p>В этой метке ещё нет опубликованных статей.</p>
                <a href="<?= esc_url(get_permalink(get_option('page_for_posts'))); ?>"
                   class="button-primary">
                    Вернуться в блог
                </a>
            </div>
        <?php endif; ?>

        <!-- CTA BLOCK -->
        <div class="cta-block reveal-item">
            <span>TECHNICAL PARTNER / K·ART·MAKE</span>
            <h5 class="cta-block__title">Есть техническая задача?</h5>
            <p class="cta-block__text">
                Опишите проблему, проект или задачу.
                Мы разберём техническую часть и предложим
                оптимальный способ решения.
            </p>
            <button class="button-primary" type="button" data-modal-func="open">
                Обсудить задачу
            </button>
        </div>
    </div>
</section>