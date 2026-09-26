<?php
/**
 * Шаблон одиночной записи блога
 *
 * @package KARTMAKE
 */
get_header();

$post_id = get_the_ID();
$blog_page = get_page_by_path('blog');
$blog_url  = esc_url($blog_page ? get_permalink($blog_page) : home_url('/blog/'));
$front_page_url  = esc_url(home_url('/'));
$thumbnail_id = get_post_thumbnail_id($post_id);
$reading_time = kartemake_get_reading_time();
$author_id = get_the_author_meta('ID');
$views = kartemake_get_post_views();
$author_position = kartemake_get_author_position($author_id);

$author_avatar = get_avatar_url(
  $author_id,
  [
    'size' => 120,
  ]
);
$author_name = get_the_author();
$author_role = function_exists('kartemake_get_author_role')
  ? kartemake_get_author_role($author_id)
  : '';
$excerpt = get_the_excerpt();
?>
  <main class="blog-detail-page">
  <!-- ============================================================
       HERO
       ============================================================ -->
    <section class="scene scene-hero" data-scene="hero">
      <div class="scene-container">
        <div class="breadcrumbs">
          <a href="<?= $front_page_url ?>">
            Главная
          </a>
          <span class="breadcrumbs__separator">/</span>
          <a href="<?= $blog_url ?>">
            Технический блог
          </a>
          <span class="breadcrumbs__separator">/</span>
          <span class="breadcrumbs__current">
            <?php the_title(); ?>
          </span>
        </div>
        <div class="hero-content">
          <div class="system-label">
            K·ART·MAKE / ТЕХНИЧЕСКИЙ БЛОГ
          </div>
          <h1>
            <?php the_title(); ?>
          </h1>
          <div class="blog-detail-meta">
            <span class="blog-detail-meta__item">
              <span class="blog-detail-meta__label">
                <?= get_post_status() == 'publish' ? 'опубликовано' : 'не опубликовано' ?>
              </span>
              <time datetime="<?= esc_attr(get_the_date('c')); ?>">
                <?= esc_html(get_the_date('j F Y')); ?>
              </time>
            </span>
            <?php if ($reading_time) : ?>
              <span class="blog-detail-meta__separator">/</span>
              <span class="blog-detail-meta__item">
                <span class="blog-detail-meta__label">
                  ВРЕМЯ ЧТЕНИЯ
                </span>
                <span>
                  <?= esc_html($reading_time); ?>
                </span>
              </span>
            <?php endif; ?>
            <?php if ($views) : ?>
              <span class="blog-detail-meta__separator">/</span>
              <span class="blog-detail-meta__item">
                <span class="blog-detail-meta__label">
                  ПРОСМОТРЫ
                </span>
                <span>
                  <?= esc_html($views); ?>
                </span>
              </span>
            <?php endif; ?>
          </div>
          <?php
            $tags = get_the_tags();
            if ($tags) :
          ?>
            <div class="blog-detail-tags">
              <?php foreach ($tags as $tag) : ?>
              <a
                href="<?= esc_url(get_tag_link($tag->term_id)) ?>"
                class="blog-detail-tag"
              >
                <?= esc_html($tag->name) ?>
              </a>
              <?php endforeach ?>
            </div>
          <?php endif ?>
        </div>
      </div>
    </section>
    <!-- ============================================================
         ARTICLE
         ============================================================ -->
    <section class="scene" data-scene="blog-article">
      <div class="scene-container reveal-item">
        <!-- ========================================================
             INTRO
             ======================================================== -->
        <div class="blog-detail-intro">
          <?php if ($excerpt) : ?>
            <p class="blog-detail-intro__description">
              <?= esc_html($excerpt); ?>
            </p>
          <?php endif; ?>
          <div class="blog-detail-author">
            <div class="blog-detail-author__avatar">
              <?php if ($author_avatar) : ?>
                <img
                  src="<?= esc_url($author_avatar) ?>"
                  alt="<?= esc_attr($author_name) ?>"
                  loading="eager"
                >
              <?php endif ?>
            </div>
            <div class="blog-detail-author__info">
              <span class="blog-detail-author__label">
                АВТОР
              </span>
              <strong>
                <?= esc_html($author_name) ?>
              </strong>
              <?php if ($author_role) : ?>
              <span>
                <?= esc_html($author_role) ?>
              </span>
              <?php endif ?>
            </div>
          </div>
        </div>
        <!-- ========================================================
             COVER
             ======================================================== -->
        <?php if ($thumbnail_id) : ?>
          <figure class="blog-detail-cover">
            <?= wp_get_attachment_image($thumbnail_id, 'full', false, [ 'loading' => 'eager' ]) ?>
            <?php
            $caption = wp_get_attachment_caption($thumbnail_id);
            if ($caption) :
            ?>
              <figcaption>
                <?= esc_html($caption) ?>
              </figcaption>
            <?php endif ?>
          </figure>
        <?php endif ?>
        <!-- ========================================================
             CONTENT GRID
             ======================================================== -->
        <div class="blog-detail-grid">
          <!-- ====================================================
               TABLE OF CONTENTS
               ==================================================== -->
          <aside
            id="sidebar"
            class="toc-sidebar blog-detail-sidebar"
            data-controller="toc"
            data-toc-content="blog-detail-body"
          >
            <nav class="toc" aria-label="Содержание статьи">
              <button
                class="toc__title"
                type="button"
                aria-expanded="true"
                data-toc-toggle
              >
                <span>СОДЕРЖАНИЕ</span>
                <span class="toc__indicator" aria-hidden="true">
                  +
                </span>
              </button>
              <div class="toc__links" data-toc-links></div>
            </nav>
            <div class="sidebar-actions">
              <a href="<?= $blog_url ?>" class="button-secondary">
                ← К блогу
              </a>
              <a href="<?= $front_page_url ?>" class="button-secondary">
                ← На главную
              </a>
            </div>
          </aside>
          <!-- ====================================================
               ARTICLE BODY
               ==================================================== -->
          <article class="blog-detail-body">
            <?php
            while (have_posts()) :
              the_post();
              the_content();
            endwhile;
            ?>
          </article>
        </div>
      </div>
    </section>
    <!-- ============================================================
         RELATED ARTICLES
         ============================================================ -->
    <?php
    $related_query = new WP_Query(
      [
        'post_type'      => 'post',
        'posts_per_page' => 4,
        'post__not_in'   => [$post_id],
        'orderby'        => 'date',
        'order'          => 'DESC',
      ]
    );
    if ($related_query->have_posts()) :
      ?>
      <section class="scene blog-detail-related" data-scene="blog-detail-related">
        <div class="scene-container">
          <header class="scene-header reveal-item">
            <div class="scene-eyebrow">
              ТЕХНИЧЕСКИЙ БЛОГ / ДАЛЬШЕ
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
          <div class="blog-articles-grid reveal-item">
            <?php
            $related_number = 1;
            while ($related_query->have_posts()) :
              $related_query->the_post();
              $related_id = get_the_ID();
              $related_thumbnail = get_post_thumbnail_id($related_id);
              $related_tags = get_the_tags($related_id);
              ?>
              <article class="blog-article">
                <span class="blog-article__number">
                  <?= esc_html(str_pad($related_number,2,'0',STR_PAD_LEFT)) ?>
                </span>
                <div class="blog-article__image">
                  <span class="blog-article__type">
                    <?php
                    $categories = get_the_category();
                    echo $categories ? esc_html($categories[0]->name) : 'ARTICLE';
                    ?>
                  </span>
                  <?php if ($related_thumbnail) : ?>
                    <?php
                    echo wp_get_attachment_image($related_thumbnail,'large',false,['loading' => 'lazy']);
                    ?>
                  <?php endif ?>
                </div>
                <div class="blog-article__content">
                  <div class="blog-article__meta">
                    <span class="blog-article__meta-item">
                      <?= esc_html(function_exists('kartemake_get_reading_time') ? kartemake_get_reading_time(get_the_content()) : '') ?>
                    </span>
                    <span class="blog-article__meta-item">
                      <?= esc_html(get_the_date('j M Y')); ?>
                    </span>
                  </div>
                  <h4 class="blog-article__title">
                    <a href="<?php the_permalink() ?>">
                      <?php the_title() ?>
                    </a>
                  </h4>
                  <p class="blog-article__description">
                    <?= esc_html(get_the_excerpt()) ?>
                  </p>
                  <?php if ($related_tags) : ?>
                    <div class="blog-article__tags">
                      <?php foreach ($related_tags as $related_tag) : ?>
                        <a
                          href="<?= esc_url(get_tag_link($related_tag->term_id)) ?>"
                          class="blog-article__tag"
                        >
                          <?= esc_html($related_tag->name) ?>
                        </a>
                      <?php endforeach ?>
                    </div>
                  <?php endif ?>
                  <a
                    href="<?php the_permalink() ?>"
                    class="blog-article__link"
                  >
                    <p>Читать статью</p>
                    <span class="blog-article__link-arrow">
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
        </div>
      </section>
    <?php endif; ?>

<?php get_footer(); ?>