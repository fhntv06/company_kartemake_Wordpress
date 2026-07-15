<?php
/**
 * Template Name: Блог
 * Description: Страница со списком записей технического блога
 */

get_header();
?>

    <main>
        <section id="hero" class="blog-navigation">
            <div class="container">
                <a href="<?php echo home_url('/'); ?>" class="back-link">
                    <i class="fas fa-arrow-left"></i>
                    <span>Назад на главную</span>
                </a>

                <div class="breadcrumbs">
                    <a href="<?php echo home_url('/'); ?>">Главная</a>
                    <span>/</span>
                    <span>Технический блог</span>
                </div>

                <h1>Технический <span class="color-accent-red">блог</span></h1>

                <div class="project-meta">
                    <i class="far fa-file-alt"></i>
                    <span>Всего публикаций: <span><?php echo wp_count_posts('post')->publish; ?></span></span>
                </div>

                <div class="cards-grid">
                    <?php
                    $paged = get_query_var('paged') ? get_query_var('paged') : 1;
                    $blog_query = new WP_Query([
                        'post_type'      => 'post',
                        'posts_per_page' => 8,
                        'paged'          => $paged,
                        'post_status'    => 'publish',
                    ]);

                    if ($blog_query->have_posts()) :
                    $counter = 0;
                    while ($blog_query->have_posts()) : $blog_query->the_post();
                    $counter++;

                    $reading_time = get_post_meta(get_the_ID(), 'reading_time', true);
                    if (empty($reading_time)) {
                        $reading_time = ceil(str_word_count(get_the_content()) / 200);
                    }

                    $views = get_post_meta(get_the_ID(), 'post_views', true);
                    if (empty($views)) {
                        $views = rand(1000, 3000);
                    }

                    $card_class = ($counter === 1) ? 'featured-card' : 'regular-card';
                    $image_class = ($counter === 1) ? 'featured-image' : 'regular-image';
                    $content_class = ($counter === 1) ? 'featured-content' : 'regular-content';
                    $meta_class = ($counter === 1) ? 'featured-meta' : 'regular-meta';
                    $meta_item_class = ($counter === 1) ? 'featured-meta__item' : 'regular-meta__item';
                    $title_tag = ($counter === 1) ? 'h3' : 'h2';
                    $title_class = ($counter === 1) ? 'featured-title' : 'regular-title';
                    $desc_class = ($counter === 1) ? 'featured-description' : 'regular-description';
                    $tags_class = ($counter === 1) ? 'featured-tags' : 'regular-tags';
                    $tag_class = ($counter === 1) ? 'featured-tag' : 'regular-tag';
                    $link_class = ($counter === 1) ? 'featured-link' : 'regular-link';
                    $link_text = ($counter === 1) ? 'Читать кейс' : 'Читать статью';
                    ?>

                    <article class="<?php echo $card_class; ?>">
                        <div class="<?php echo $image_class; ?>">
                            <?php if (has_post_thumbnail()) : ?>
                                <img src="<?php echo get_the_post_thumbnail_url(get_the_ID(), 'large'); ?>"
                                     alt="<?php the_title_attribute(); ?>">
                            <?php else : ?>
                                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/blog-placeholder.jpg"
                                     alt="<?php the_title_attribute(); ?>">
                            <?php endif; ?>
                        </div>

                        <div class="<?php echo $content_class; ?>">
                            <div class="<?php echo $meta_class; ?>">
                                <div class="<?php echo $meta_item_class; ?>">
                                    <i class="far fa-clock"></i>
                                    <span><?php echo $reading_time; ?> мин</span>
                                </div>
                                <div class="<?php echo $meta_item_class; ?>">
                                    <i class="far fa-eye"></i>
                                    <span><?php echo number_format($views); ?></span>
                                </div>
                                <div class="<?php echo $meta_item_class; ?>">
                                    <i class="far fa-calendar"></i>
                                    <span><?php echo get_the_date('j M Y'); ?></span>
                                </div>
                            </div>

                            <<?php echo $title_tag; ?> class="<?php echo $title_class; ?>">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </<?php echo $title_tag; ?>>

                        <p class="<?php echo $desc_class; ?>">
                            <?php echo wp_trim_words(get_the_excerpt(), ($counter === 1) ? 40 : 25, '...'); ?>
                        </p>

                        <div class="<?php echo $tags_class; ?>">
                            <?php
                            $post_tags = get_the_tags();
                            if ($post_tags) {
                                foreach ($post_tags as $tag) {
                                    echo '<a href="' . get_tag_link($tag->term_id) . '" class="' . $tag_class . '">' . $tag->name . '</a>';
                                }
                            } else {
                                $categories = get_the_category();
                                foreach ($categories as $category) {
                                    echo '<a href="' . get_category_link($category->term_id) . '" class="' . $tag_class . '">' . $category->name . '</a>';
                                }
                            }
                            ?>
                        </div>

                        <a href="<?php the_permalink(); ?>" class="<?php echo $link_class; ?>">
                            <span class="read-more-text"><?php echo $link_text; ?></span>
                            <i class="fas fa-arrow-right read-more-arrow"></i>
                        </a>
                </div>
                </article>

                <?php
                endwhile;
                wp_reset_postdata();
                endif;
                ?>
            </div>

            <?php if ($blog_query->max_num_pages > 1) : ?>
                <div class="pagination">
                    <a href="<?php echo get_pagenum_link($paged - 1); ?>"
                       class="pagination-button <?php echo ($paged <= 1) ? 'disabled' : ''; ?>">
                        &lt;
                    </a>
                    <div class="pagination-pages">
                        <?php
                        for ($i = 1; $i <= $blog_query->max_num_pages; $i++) {
                            $active_class = ($i == $paged) ? 'active' : '';
                            echo '<a href="' . get_pagenum_link($i) . '" class="pagination-page ' . $active_class . '">' . $i . '</a>';
                        }
                        ?>
                    </div>
                    <a href="<?php echo get_pagenum_link($paged + 1); ?>"
                       class="pagination-button <?php echo ($paged >= $blog_query->max_num_pages) ? 'disabled' : ''; ?>">
                        &gt;
                    </a>
                </div>
            <?php endif; ?>
            </div>
        </section>

        <section class="project-form">
            <div class="container form-container">
                <div class="form-header">
                    <h3>Нужен надежный технический партнер?</h3>
                    <p>Опишите вашу задачу — мы проведем бесплатный аудит и предложим решение по поддержке или развитию вашего digital-продукта</p>
                </div>

                <form class="contact-form" data-controller="form" method="POST" action="<?php echo admin_url('admin-post.php'); ?>">
                    <?php wp_nonce_field('kartemake_form_submit', 'kartemake_nonce'); ?>
                    <input type="hidden" name="action" value="kartemake_submit_form">

                    <div class="form-group">
                        <input type="text" class="form-input" name="name" id="name-project-form" placeholder=" " required>
                        <label for="name-project-form" class="form-label">Имя</label>
                    </div>

                    <div class="form-group">
                        <input type="text" class="form-input" name="company" id="company-project-form" placeholder=" ">
                        <label for="company-project-form" class="form-label">Название компании</label>
                    </div>

                    <div class="form-group">
                        <input type="email" class="form-input" name="email" id="email-project-form" placeholder=" " required>
                        <label for="email-project-form" class="form-label">Email</label>
                    </div>

                    <div class="form-group">
                        <input type="tel" class="form-input" name="phone" id="phone-project-form" placeholder=" " required>
                        <label for="phone-project-form" class="form-label">Телефон</label>
                    </div>

                    <div class="form-group full-width">
                        <textarea class="form-input" name="message" id="message-project-form" placeholder=" " required></textarea>
                        <label for="message-project-form" class="form-label">Опишите вашу задачу или проблему</label>
                    </div>

                    <div class="form-button">
                        <button type="submit" class="cta-button" data-controller-ripple-effect="item">
                            Обсудить задачу
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>

                    <p class="form-notice">Нажимая на кнопку, вы соглашаетесь с
                        <a href="<?php echo get_privacy_policy_url(); ?>">политикой конфиденциальности</a>
                    </p>
                </form>
            </div>
        </section>
    </main>

<?php get_footer(); ?>

