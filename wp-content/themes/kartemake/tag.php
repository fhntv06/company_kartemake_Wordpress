<?php
/**
 * Tag archive
 *
 * @package KARTEMAKE
 */
get_header();
$tag = get_queried_object();
$tag_name        = single_tag_title('', false);
$tag_description = tag_description();
$tag_query = new WP_Query([
    'post_type'           => 'post',
    'post_status'         => 'publish',
    'posts_per_page'      => 4,
    'paged'               => max(1, get_query_var('paged')),
    'tag_id'              => $tag->term_id,
    'ignore_sticky_posts' => true,
]);
?>
    <main class="tag-page">
        <!-- =====================================================
             HERO
        ====================================================== -->
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
                    <a href="<?= esc_url(get_permalink(get_option('page_for_posts'))); ?>">
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
                        <p>
                            <?= wp_kses_post($tag_description); ?>
                        </p>
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
                        <strong>
                            <?= esc_html($tag->count); ?>
                        </strong>
                    </span>
                    </div>
                </div>
            </div>
        </section>
        <!-- =====================================================
             ARCHIVE
        ====================================================== -->
        <section class="scene tag-articles" data-scene="articles">
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
                    <div class="card-articles-grid">
                        <?php
                        $article_number = 1;
                        ?>
                        <?php while ($tag_query->have_posts()) : ?>
                            <?php
                            $tag_query->the_post();
                            $categories = get_the_category();
                            $tags       = get_the_tags();
                            $category = !empty($categories)
                                ? $categories[0]
                                : null;
                            $reading_time = get_post_meta(
                                get_the_ID(),
                                'reading_time',
                                true
                            );
                            ?>
                            <article class="card-article">
                            <span class="card-article__number">
                                <?= esc_html(
                                    str_pad(
                                        $article_number,
                                        2,
                                        '0',
                                        STR_PAD_LEFT
                                    )
                                ); ?>
                            </span>
                                <div class="card-article__image">
                                <span class="card-article__type">
                                    <?= $category
                                        ? esc_html(
                                            strtoupper($category->name)
                                        )
                                        : 'ARTICLE';
                                    ?>
                                </span>
                                    <?php if (has_post_thumbnail()) : ?>
                                        <?php
                                        the_post_thumbnail(
                                            'large',
                                            [
                                                'loading' => 'lazy',
                                                'alt'     => esc_attr(
                                                    get_the_title()
                                                ),
                                            ]
                                        );
                                        ?>
                                    <?php endif; ?>
                                </div>
                                <div class="card-article__content">
                                    <div class="card-article__meta">
                                    <span class="card-article__meta-item">
                                        <?php if ($reading_time) : ?>
                                            <?= esc_html($reading_time); ?>
                                            MIN
                                        <?php else : ?>
                                            —
                                        <?php endif; ?>
                                    </span>
                                        <span class="card-article__meta-item">
                                        <?= esc_html(
                                            get_the_date('d M Y')
                                        ); ?>
                                    </span>
                                    </div>
                                    <h4 class="card-article__title">
                                        <a
                                            href="<?= esc_url(
                                                get_permalink()
                                            ); ?>"
                                        >
                                            <?= esc_html(
                                                get_the_title()
                                            ); ?>
                                        </a>
                                    </h4>
                                    <p class="card-article__description">
                                        <?= esc_html(
                                            get_the_excerpt()
                                        ); ?>
                                    </p>
                                    <?php if (!empty($tags)) : ?>
                                        <div class="card-article__tags">
                                            <?php foreach ($tags as $tag_item) : ?>
                                                <a
                                                    href="<?= esc_url(
                                                        get_tag_link(
                                                            $tag_item->term_id
                                                        )
                                                    ); ?>"
                                                    class="card-article__tag"
                                                >
                                                    <?= esc_html(
                                                        $tag_item->name
                                                    ); ?>
                                                </a>
                                            <?php endforeach; ?>
                                        </div>
                                    <?php endif; ?>
                                    <a
                                        href="<?= esc_url(
                                            get_permalink()
                                        ); ?>"
                                        class="card-article__link"
                                    >
                                        <p>
                                            Читать статью
                                        </p>
                                        <span class="card-article__link-arrow">
                                        ↗
                                    </span>
                                    </a>
                                </div>
                            </article>
                            <?php
                            $article_number++;
                            ?>
                        <?php endwhile; ?>

                      <!-- =================================================
                           PAGINATION
                      ================================================== -->
                        <?php if ($tag_query->max_num_pages > 1) : ?>
                            <nav
                                class="tag-pagination"
                                aria-label="Навигация по страницам"
                            >
                            <?php
                            echo paginate_links([
                                'total'     => $tag_query->max_num_pages,
                                'current'   => max(
                                  1,
                                  get_query_var('paged')
                                ),
                                'mid_size'  => 1,
                                'prev_text' => '←',
                                'next_text' => '→',
                              ]);
                            ?>
                          </nav>
                        <?php endif; ?>
                    </div>

                <?php else : ?>
                    <div class="tag-empty">
                        <span class="system-label">
                            NO PUBLICATIONS
                        </span>
                        <h3>
                            Материалов пока нет.
                        </h3>
                        <p>
                            В этой метке ещё нет опубликованных статей.
                        </p>
                        <a
                            href="<?= esc_url(
                                get_permalink(
                                    get_option('page_for_posts')
                                )
                            ); ?>"
                            class="button-primary"
                        >
                            Вернуться в блог
                        </a>
                    </div>
                <?php endif; ?>

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
    </main>
<?php
wp_reset_postdata();
get_footer();
?>

