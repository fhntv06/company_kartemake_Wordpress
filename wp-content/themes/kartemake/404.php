<?php
/**
 * Шаблон страницы 404
 *
 * @package KARTMAKE
 */

get_header();

$related_query = new WP_Query(
  [
    'post_type' => ['post', 'cases'],
    'posts_per_page' => 4,
    'paged' => 1,
    'orderby' => 'date',
    'order' => 'DESC',
  ]
);

$used_categories = []; // slug => name

while ($related_query->have_posts()) {
  $related_query->the_post();
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

$related_query->rewind_posts();
?>

<main>
  <section class="scene scene-hero error-404" data-scene="hero" data-canvas-engine>
    <canvas id="heroCanvas" class="hero-canvas" aria-hidden="true"></canvas>
    <div class="scene-container">
      <div class="hero-content">
        <div class="system-label">ОШИБКА 404</div>
        <h1>Страница <span>не найдена</span></h1>
        <p>
          Запрашиваемая страница была перемещена, удалена или никогда не существовала.
          <br>
          Возможно, вы перешли по устаревшей ссылке или допустили опечатку в адресе.
        </p>
        <div class="hero-note">DEVELOPMENT · SUPPORT · AUDIT · INFRASTRUCTURE</div>
        <div class="hero-actions">
          <a href="<?php echo home_url('/'); ?>" class="button-primary">
            ← На главную
          </a>
          <a href="mailto:support@kartemake.ru" class="button-secondary">
            Сообщить о проблеме
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================================
   RELATED ARTICLES
   ============================================================ -->
  <section class="scene blog-detail-related" data-scene="blog-detail-related" data-filter-cards>
    <div class="scene-container">
      <header class="scene-header reveal-item">
        <div class="scene-eyebrow">
          Интересные записи
        </div>
        <h2 class="scene-title">
          Похожие материалы
        </h2>
        <p class="scene-description">
          Реальные кейсы, технические разборы и решения
          задач, с которыми сталкивается бизнес
          в цифровой среде.
        </p>
      </header>

      <?php if (!$related_query->have_posts()): ?>
        <div class="tag-empty reveal-item">
          <span class="system-label">NO PUBLICATIONS</span>
          <h3>Материалов пока нет.</h3>
          <p>Посты не опубликованы</p>
          <a href="<?= home_url('/'); ?>" class="button-primary">
            На страницу кейсов
          </a>
        </div>
      <?php else: ?>
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
        <div class="card-articles-grid reveal-item" data-filter-grid>
          <?php
          $related_number = 1;
          while ($related_query->have_posts()) :
            $related_query->the_post();

            $post_cats = get_the_category();
            $related_id = get_the_ID();
            $related_thumbnail = get_post_thumbnail_id($related_id);
            $related_tags = get_the_tags($related_id);

            $cat_slugs = !empty($post_cats)
              ? implode(' ', wp_list_pluck($post_cats, 'slug'))
              : 'article';

            $cat_names = !empty($post_cats)
              ? implode(' / ', wp_list_pluck($post_cats, 'name'))
              : 'ARTICLE';
            ?>
            <article class="card-article"
                     data-filter-type="<?= esc_attr($cat_slugs); ?>"
                     data-case-index="<?= esc_attr($related_number); ?>"
            >
            <span class="card-article__number">
              <?= esc_html(str_pad($related_number, 2, '0', STR_PAD_LEFT)) ?>
            </span>
              <div class="card-article__image">
                  <span class="card-article__type">
                    <?= esc_html(mb_strtoupper($cat_names)); ?>
                  </span>
                <?php if ($related_thumbnail) : ?>
                  <?php
                  echo wp_get_attachment_image($related_thumbnail, 'large', false, ['loading' => 'lazy']);
                  ?>
                <?php endif ?>
              </div>
              <div class="card-article__content">
                <div class="card-article__meta">
                <span class="card-article__meta-item">
                  <?= esc_html(function_exists('kartemake_get_reading_time') ? kartemake_get_reading_time(get_the_content()) : '') ?>
                </span>
                  <span class="card-article__meta-item">
                  <?= esc_html(get_the_date('j M Y')); ?>
                </span>
                </div>
                <h4 class="card-article__title">
                  <a href="<?php the_permalink() ?>">
                    <?php the_title() ?>
                  </a>
                </h4>
                <p class="card-article__description">
                  <?= esc_html(get_the_excerpt()) ?>
                </p>
                <?php if ($related_tags) : ?>
                  <div class="card-article__tags">
                    <?php foreach ($related_tags as $related_tag) : ?>
                      <a
                        href="<?= esc_url(get_tag_link($related_tag->term_id)) ?>"
                        class="card-article__tag"
                      >
                        <?= esc_html($related_tag->name) ?>
                      </a>
                    <?php endforeach ?>
                  </div>
                <?php endif ?>
                <a
                  href="<?php the_permalink() ?>"
                  class="card-article__link"
                >
                  <p>Читать статью</p>
                  <span class="card-article__link-arrow">
                  ↗
                </span>
                </a>
              </div>
            </article>
            <?php
            $related_number++;
          endwhile;
          wp_reset_postdata();
          ?>
        </div>
        <nav class="pagination"
             data-filter-pagination
             aria-label="Навигация по страницам"></nav>
      <?php endif; ?>
    </div>
  </section>


  <?php get_footer(); ?>

