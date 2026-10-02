<?php
/**
 * Секция: Архив статей блога с фильтром по рубрикам
 *
 * @package KARTEMAKE
 */

$blog_query = new WP_Query([
  'post_type' => 'post',
  'post_status' => 'publish',
  'posts_per_page' => 50,
  'paged' => 1,
  'ignore_sticky_posts' => true,
]);

if (!$blog_query->have_posts()) {
  return;
}

// ---------------------------------------------------------
// 1. Собираем уникальные рубрики среди выведенных постов
// ---------------------------------------------------------
$used_categories = []; // slug => name

while ($blog_query->have_posts()) {
  $blog_query->the_post();
  $post_cats = get_the_category();

  if (!empty($post_cats)) {
    foreach ($post_cats as $cat) {
      if (!isset($used_categories[$cat->slug])) {
        $used_categories[$cat->slug] = $cat->name;
      }
    }
  }
}

// Сортируем по названию
asort($used_categories, SORT_NATURAL | SORT_FLAG_CASE);

// Возвращаемся к началу цикла
$blog_query->rewind_posts();
?>

<section class="scene tag-articles" data-scene="articles" data-filter-cards>
  <div class="scene-container">
    <div class="scene-header">
      <div class="scene-eyebrow">BLOG / ARCHIVE</div>
      <h2>Материалы блога</h2>
      <p class="scene-description">
        Техническая практика K·ART·MAKE:
        разработка, поддержка, производительность
        и развитие digital-продуктов.
      </p>
    </div>

    <!-- FILTER по рубрикам, которые реально встречаются -->
    <?php if (!empty($used_categories)) : ?>
      <div class="filter reveal-item" role="navigation" aria-label="Фильтр по рубрикам">
        <button class="filter__item is-active"
                type="button"
                data-filter="all"
                aria-pressed="true">
          Все
        </button>
        <?php foreach ($used_categories as $slug => $name) : ?>
          <button class="filter__item"
                  type="button"
                  data-filter="<?= esc_attr($slug); ?>"
                  aria-pressed="false">
            <?= esc_html($name); ?>
          </button>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <?php if(! $blog_query->have_posts()): ?>
      <div class="tag-empty reveal-item">
        <span class="system-label">NO PUBLICATIONS</span>
        <h3>Материалов пока нет.</h3>
        <p>Посты не опубликованы</p>
        <a href="<?= home_url('/'); ?>" class="button-primary">
          На страницу кейсов
        </a>
      </div>
      <?php else: ?>
      <div class="card-articles-grid reveal-item" data-filter-grid>
        <?php $i = 1; ?>
        <?php while ($blog_query->have_posts()) : $blog_query->the_post(); ?>
          <?php
          $post_cats = get_the_category();
          $tags = get_the_tags();
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
                   data-case-index="<?= esc_attr($i); ?>">

                      <span class="card-article__number">
                          <?= esc_html(str_pad($i, 2, '0', STR_PAD_LEFT)); ?>
                      </span>

            <div class="card-article__image">
              <span class="card-article__type">
                <?= esc_html(mb_strtoupper($cat_names)); ?>
              </span>
              <?php if (has_post_thumbnail()) : ?>
                <?php the_post_thumbnail('large', [
                  'loading' => 'lazy',
                  'alt' => esc_attr(get_the_title()),
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

          <?php $i++; ?>
        <?php endwhile; ?>
        <?php wp_reset_postdata(); ?>
      </div>
      <nav class="pagination"
           data-filter-pagination
           aria-label="Навигация по страницам"></nav>
    <?php endif; ?>

    <!-- CTA -->
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