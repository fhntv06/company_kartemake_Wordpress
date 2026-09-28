<!-- ======================================================
BLOG ARTICLES
====================================================== -->
<section class="scene blog-articles" data-scene="blog-articles">
    <div class="scene-container">
        <header class="scene-header reveal-item">
            <div class="scene-eyebrow">АРХИВ / ENGINEERING</div>
            <h2 class="scene-title">Инженерная практика <span>без теории</span></h2>
            <p class="scene-description">Реальные кейсы, технические разборы и решения задач, с которыми сталкивается бизнес в цифровой среде.</p>
        </header>

        <!-- ============================================================
        REGULAR ARTICLES
        ============================================================ -->
      <div class="card-articles-grid reveal-item">
        <?php
        $featured_id = get_the_ID();
        $blog_query = new WP_Query([
          'post_type'      => 'post',
          'posts_per_page' => 7,
          'post_status'    => 'publish',
          'post__not_in'   => [$featured_id],
        ]);
        if ($blog_query->have_posts()) :
          $article_number = 1;
          while ($blog_query->have_posts()) :
            $blog_query->the_post();
            $reading_time = get_post_meta(get_the_ID(), 'reading_time', true);
            $terms = get_the_category();
            $category_name = !empty($terms)
              ? $terms[0]->name
              : 'ARTICLE';
            ?>
            <article class="card-article">
                <span class="card-article__number">
                    <?= str_pad($article_number, 2, '0', STR_PAD_LEFT); ?>
                </span>
              <div class="card-article__image">
                    <span class="card-article__type">
                        <?= esc_html(strtoupper($category_name)); ?>
                    </span>
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
              <div class="card-article__content">
                <div class="card-article__meta">
                  <?php if ($reading_time) : ?>
                    <span class="card-article__meta-item">
                                <?= esc_html($reading_time); ?> MIN
                            </span>
                  <?php endif; ?>
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
                <?php if (!empty($terms)) : ?>
                  <div class="card-article__tags">
                    <?php foreach ($terms as $term) : ?>
                      <a
                        href="<?= esc_url(get_category_link($term->term_id)); ?>"
                        class="card-article__tag"
                      >
                        <?= esc_html($term->name); ?>
                      </a>
                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>
                <a
                  href="<?= esc_url(get_permalink()); ?>"
                  class="card-article__link"
                >
                  <p>Читать статью</p>
                  <span class="card-article__link-arrow">↗</span>
                </a>
              </div>
            </article>
            <?php
            $article_number++;
          endwhile;
          wp_reset_postdata();
        endif;
        ?>
      </div>

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
