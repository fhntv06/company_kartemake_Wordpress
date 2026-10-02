<?php
/**
 * Секция: Архив кейсов
 *
 * @package KARTEMAKE
 */

// ---------------------------------------------------------
// 1. Все типы кейсов — для кнопок фильтра
// ---------------------------------------------------------
$case_types = get_terms([
  'taxonomy'   => 'case_service',
  'hide_empty' => true,
]);

// ---------------------------------------------------------
// 2. Запрос кейсов — 50 сразу, пагинация на клиенте
// ---------------------------------------------------------
$cases_query = new WP_Query([
  'post_type'      => 'cases',
  'post_status'    => 'publish',
  'posts_per_page' => 50,
  'paged'          => 1, // JS-пагинация, серверная не нужна
  'orderby'        => 'date',
  'order'          => 'DESC',
  'ignore_sticky_posts' => true,
]);

if (!$cases_query->have_posts()) {
  return;
}
?>

<section class="scene cases-archive" data-scene="cases-archive" data-filter-cards>
  <div class="scene-container">

    <header class="scene-header reveal-item">
      <div class="scene-eyebrow">
        АРХИВ / PROJECTS
      </div>
      <h2 class="scene-title">
        Реальные проекты
        <span>и техническая практика</span>
      </h2>
      <p class="scene-description">
        Кейсы показывают не только итоговый продукт,
        но и задачу, процесс работы, технические решения
        и полученный результат.
      </p>
    </header>

    <!-- =================================================
         FILTER
         ================================================== -->
    <?php if (!empty($case_types) && !is_wp_error($case_types)) : ?>
      <div class="filter reveal-item"
           role="navigation"
           aria-label="Фильтр кейсов">

        <button class="filter__item is-active"
                type="button"
                data-filter="all"
                aria-pressed="true">
          Все
        </button>

        <?php foreach ($case_types as $term) : ?>
          <button class="filter__item"
                  type="button"
                  data-filter="<?= esc_attr($term->slug); ?>"
                  aria-pressed="false">
            <?= esc_html($term->name); ?>
          </button>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <!-- =================================================
         CASES GRID
         ================================================== -->
    <div class="card-articles-grid reveal-item" data-filter-grid>
      <?php $i = 1; ?>
      <?php while ($cases_query->have_posts()) : $cases_query->the_post(); ?>
        <?php
        $post_id = get_the_ID();

        // Все типы этого кейса
        $types = get_the_terms($post_id, 'case_service');

        // Все теги этого кейса
        $tags = get_the_terms($post_id, 'case_tag');

        // Слаги типов через пробел — для data-filter-type
        $type_slugs = (!empty($types) && !is_wp_error($types))
          ? implode(' ', wp_list_pluck($types, 'slug'))
          : 'case';

        // Названия типов через " / " — для meta
        $type_names = (!empty($types) && !is_wp_error($types))
          ? implode(' / ', wp_list_pluck($types, 'name'))
          : 'CASE';
        ?>
        <article class="card-article"
                 data-filter-type="<?= esc_attr($type_slugs); ?>"
                 data-case-index="<?= esc_attr($i); ?>">

                    <span class="card-article__number">
                        <?= esc_html(str_pad($i, 2, '0', STR_PAD_LEFT)); ?>
                    </span>

          <div class="card-article__image">
            <span class="card-article__type">
              <?= esc_html(mb_strtoupper($type_names)); ?>
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
                                <?= esc_html(mb_strtoupper($type_names)); ?>
                            </span>
              <span class="card-article__meta-item">
                                <?= esc_html(get_the_date('d M Y')); ?>
                            </span>
            </div>

            <h4 class="card-article__title">
              <a href="<?php the_permalink(); ?>">
                <?php the_title(); ?>
              </a>
            </h4>

            <p class="card-article__description">
              <?= esc_html(get_the_excerpt()); ?>
            </p>

            <?php if (!empty($tags) && !is_wp_error($tags)) : ?>
              <div class="card-article__tags">
                <?php foreach ($tags as $tag) : ?>
                  <a href="<?= esc_url(get_term_link($tag)); ?>"
                     class="card-article__tag">
                    <?= esc_html($tag->name); ?>
                  </a>
                <?php endforeach; ?>
              </div>
            <?php endif; ?>

            <a href="<?php the_permalink(); ?>"
               class="card-article__link">
              <p>Читать кейс</p>
              <span class="card-article__link-arrow">↗</span>
            </a>
          </div>
        </article>
        <?php $i++; ?>
      <?php endwhile; ?>
      <?php wp_reset_postdata(); ?>
    </div>

    <!-- =================================================
         PAGINATION (рендерится из Filter)
         ================================================== -->
    <nav class="pagination"
         data-filter-pagination
         aria-label="Навигация по страницам"></nav>

    <!-- =================================================
         CTA
         ================================================== -->
    <div class="cta-block reveal-item">
      <span>TECHNICAL PARTNER / K·ART·MAKE</span>
      <h5 class="cta-block__title">
        Есть техническая задача?
      </h5>
      <p class="cta-block__text">
        Опишите проблему, проект или задачу.
        Мы разберём техническую часть и предложим
        оптимальный способ решения.
      </p>
      <button class="button-primary"
              type="button"
              data-modal-func="open">
        Обсудить задачу
      </button>
    </div>

  </div>
</section>