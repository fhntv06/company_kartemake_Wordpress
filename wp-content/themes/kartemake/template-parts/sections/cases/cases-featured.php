<?php
/**
 * Секция: Featured кейс
 *
 * @package KARTEMAKE
 */

$featured_query = new WP_Query([
  'post_type'      => 'cases',
  'post_status'    => 'publish',
  'posts_per_page' => 1,
  'orderby'        => 'date',
  'order'          => 'DESC',
]);

// Ссылка на архив кейсов
$cases_archive_url = get_post_type_archive_link('case');
if (!$cases_archive_url) {
  $cases_page = get_page_by_path('cases');
  $cases_archive_url = $cases_page ? get_permalink($cases_page) : home_url('/');
}
?>

  <section class="scene cases-featured" data-scene="cases-featured">
    <div class="scene-container">

      <header class="scene-header reveal-item">
        <div class="scene-eyebrow">ИЗБРАННОЕ / CASE STUDY</div>
        <h2 class="scene-title">
          Проект, <span>который показывает подход</span>
        </h2>
        <p class="scene-description">
          Разбираем реальную техническую задачу: контекст проекта,
          принятые решения, процесс работы и результат.
        </p>
      </header>

      <?php if (!$featured_query->have_posts()) : ?>

        <div class="tag-empty reveal-item">
          <span class="system-label">NO PUBLICATIONS</span>
          <h3>Материалов пока нет.</h3>
          <p>Избранного кейса ещё нет.</p>
          <a href="<?= esc_url($cases_archive_url); ?>" class="button-primary">
            На страницу кейсов
          </a>
        </div>

      <?php else : ?>

        <?php $featured_query->the_post(); ?>
        <?php
        $post_id = get_the_ID();

        // Типы кейса (таксономия case_type)
        $types = get_the_terms($post_id, 'case_type');
        $type_label = (!empty($types) && !is_wp_error($types))
          ? implode(' · ', wp_list_pluck($types, 'name'))
          : 'CASE';

        // Теги кейса (таксономия case_tag)
        $tags = get_the_terms($post_id, 'case_tag');
        ?>

        <div class="cases-featured-layout reveal-item">

          <!-- FEATURED VISUAL -->
          <article class="cases-featured-visual">
            <a href="<?php the_permalink(); ?>"
               class="cases-featured-image"
               aria-label="Открыть кейс <?php the_title_attribute(); ?>">
              <?php if (has_post_thumbnail()) : ?>
                <?php the_post_thumbnail('large', [
                  'loading' => 'lazy',
                  'alt'     => get_the_title(),
                ]); ?>
              <?php else : ?>
                <img src="<?= esc_url(get_template_directory_uri() . '/public/images/cases/rdp/rdp-main.jpeg'); ?>"
                     alt="<?php the_title_attribute(); ?>"
                     loading="lazy">
              <?php endif; ?>
            </a>

            <div class="cases-featured-status">
              FEATURED / CASE
            </div>

            <div class="cases-featured-visual-content">
                        <span class="cases-featured-category">
                            <?= esc_html(mb_strtoupper($type_label)); ?>
                        </span>
              <h3>
                <a href="<?php the_permalink(); ?>">
                  <?php the_title(); ?>
                </a>
              </h3>
            </div>
          </article>

          <!-- FEATURED CONTENT -->
          <div class="cases-featured-content">

            <div class="cases-featured-meta">
              <div class="cases-featured-meta-item">
                <span class="cases-featured-meta-label">CLIENT</span>
                <span class="cases-featured-meta-value">
                                <?= esc_html(get_field('case_client', $post_id) ?: '—'); ?>
                            </span>
              </div>
              <div class="cases-featured-meta-item">
                <span class="cases-featured-meta-label">TYPE</span>
                <span class="cases-featured-meta-value">
                                <?= esc_html(get_field('case_type', $post_id) ?: $type_label); ?>
                            </span>
              </div>
              <div class="cases-featured-meta-item">
                <span class="cases-featured-meta-label">YEAR</span>
                <span class="cases-featured-meta-value">
                                <?= esc_html(get_field('case_year', $post_id) ?: get_the_date('Y')); ?>
                            </span>
              </div>
            </div>

            <p class="cases-featured-description">
              <?= esc_html(get_the_excerpt()); ?>
            </p>

            <?php if (!empty($tags) && !is_wp_error($tags)) : ?>
              <div class="cases-featured-tags">
                <?php foreach ($tags as $tag) : ?>
                  <a href="<?= esc_url(get_term_link($tag)); ?>"
                     class="cases-featured-tag">
                    <?= esc_html($tag->name); ?>
                  </a>
                <?php endforeach; ?>
              </div>
            <?php endif; ?>

            <a href="<?php the_permalink(); ?>" class="cases-featured-link">
              <span>Смотреть кейс</span>
              <span class="cases-featured-link-arrow">↗</span>
            </a>
          </div>
        </div>

      <?php endif; ?>

    </div>
  </section>

<?php wp_reset_postdata(); ?>