<!-- ======================================================
BLOG FEATURED
====================================================== -->
<section class="scene blog-featured" data-scene="blog-featured">
    <div class="scene-container">
        <header class="scene-header reveal-item">
            <div class="scene-eyebrow">ИЗБРАННОЕ / CASE STUDY</div>
            <h2 class="scene-title">Главный материал</h2>
            <p class="scene-description">Разбираем проект от исходной задачи до технического результата.</p>
        </header>
        <div class="blog-featured-layout reveal-item">
          <?php
            $featured_id = 0;
            $featured_query = new WP_Query([
              'post_type'      => 'post',
              'post_status'    => 'publish',
              'orderby' => 'date',
              'order'   => 'DESC',
              'posts_per_page' => 1,
            ]);
          ?>
          <?php if ($featured_query->have_posts()) : ?>
            <?php while ($featured_query->have_posts()) : $featured_query->the_post(); ?>
              <?php
              $reading_time = get_post_meta(get_the_ID(), 'reading_time', true);
              $categories   = get_the_category();
              $tags         = get_the_tags();
              $category_name = !empty($categories)
                ? $categories[0]->name
                : 'ARTICLE';
              ?>
              <article class="blog-featured-visual">
                <div class="blog-featured-image">
                  <?php if (has_post_thumbnail()) : ?>
                    <?php
                    the_post_thumbnail(
                      'large',
                      [
                        'loading' => 'lazy',
                        'alt'     => esc_attr(get_the_title()),
                      ]
                    );
                    ?>
                  <?php endif; ?>
                </div>
                <div class="blog-featured-status">
                  FEATURED / <?= esc_html(strtoupper($category_name)); ?>
                </div>
                <div class="blog-featured-visual-content">
                <span class="blog-featured-category">
                    <?= esc_html(strtoupper($category_name)); ?>
                </span>
                  <h3>
                    <a href="<?= esc_url(get_permalink()); ?>">
                      <?= esc_html(get_the_title()); ?>
                    </a>
                  </h3>
                </div>
              </article>
              <div class="blog-featured-content">
                <div class="blog-featured-meta">
                  <div class="blog-featured-meta-item">
                    <span class="blog-featured-meta-label">DATE</span>
                    <span class="blog-featured-meta-value">
                        <?= esc_html(get_the_date('d.m.Y')); ?>
                    </span>
                  </div>
                  <div class="blog-featured-meta-item">
                    <span class="blog-featured-meta-label">READ</span>
                    <span class="blog-featured-meta-value">
                        <?= $reading_time
                          ? esc_html($reading_time) . ' MIN'
                          : '—';
                        ?>
                    </span>
                  </div>
                  <div class="blog-featured-meta-item">
                    <span class="blog-featured-meta-label">TYPE</span>
                    <span class="blog-featured-meta-value">
                        <?= esc_html(strtoupper($category_name)); ?>
                    </span>
                  </div>
                </div>
                <p class="blog-featured-description">
                  <?= esc_html(get_the_excerpt()); ?>
                </p>
                <?php if ($tags) : ?>
                  <div class="blog-featured-tags">
                    <?php foreach ($tags as $tag) : ?>
                      <a
                        href="<?= esc_url(get_tag_link($tag->term_id)); ?>"
                        class="blog-featured-tag"
                      >
                        <?= esc_html($tag->name); ?>
                      </a>
                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>
                <a
                  href="<?= esc_url(get_permalink()); ?>"
                  class="blog-featured-link"
                >
                  <span>Читать статью</span>
                  <span class="blog-featured-link-arrow">↗</span>
                </a>
              </div>
            <?php endwhile; ?>
            <?php wp_reset_postdata(); ?>
          <?php endif; ?>
        </div>
    </div>
</section>
