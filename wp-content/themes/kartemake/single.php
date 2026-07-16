<?php
/**
 * Шаблон отдельной записи блога
 */

get_header();

if (have_posts()) :
    while (have_posts()) : the_post();

        $reading_time = get_post_meta(get_the_ID(), 'reading_time', true);
        if (empty($reading_time)) {
            $reading_time = ceil(str_word_count(get_the_content()) / 200);
        }

        $views = get_post_meta(get_the_ID(), 'post_views', true);
        if (empty($views)) {
            $views = rand(1000, 3000);
        }
        update_post_meta(get_the_ID(), 'post_views', $views + 1);

        $categories = get_the_category();
        $tags = get_the_tags();
        ?>

        <main>
            <section class="project-detail">
                <div class="container">
                    <!-- Кнопка назад -->
                    <a href="<?php echo get_permalink(get_option('page_for_posts')); ?>" class="back-link">
                        <i class="fas fa-arrow-left"></i>
                        <span>Назад к блогу</span>
                    </a>

                    <!-- Хлебные крошки -->
                    <div class="breadcrumbs">
                        <a href="<?php echo home_url('/'); ?>">Главная</a>
                        <span>/</span>
                        <a href="<?php echo get_permalink(get_option('page_for_posts')); ?>">Технический блог</a>
                        <span>/</span>
                        <span><?php the_title(); ?></span>
                    </div>

                    <h1 class="project-title">
                        <?php the_title(); ?>
                    </h1>

                    <div class="project-meta">
                        <div>
                            <i class="far fa-clock"></i>
                            <span>Время чтения: <?php echo $reading_time; ?> минут</span>
                        </div>
                        <div>
                            <i class="far fa-eye"></i>
                            <span><?php echo number_format($views); ?> просмотр<?php echo ($views > 1) ? 'а' : ''; ?></span>
                        </div>
                        <div>
                            <i class="far fa-calendar"></i>
                            <span><?php echo get_the_date('j F Y'); ?></span>
                        </div>
                    </div>

                    <div class="project-tags">
                        <?php
                        if ($tags) {
                            foreach ($tags as $tag) {
                                echo '<a href="' . get_tag_link($tag->term_id) . '" class="project-tag">' . $tag->name . '</a>';
                            }
                        } else {
                            foreach ($categories as $category) {
                                echo '<a href="' . get_category_link($category->term_id) . '" class="project-tag">' . $category->name . '</a>';
                            }
                        }
                        ?>
                    </div>

                    <div class="project-summary">
                        <p class="project-description">
                            <?php echo get_the_excerpt(); ?>
                        </p>

                        <div class="project-author">
                            <div class="author-avatar">
                                <?php echo get_avatar(get_the_author_meta('ID'), 200); ?>
                            </div>
                            <div class="author-info">
                                <h4><?php the_author(); ?></h4>
                                <p><?php echo get_the_author_meta('position'); ?></p>
                            </div>
                        </div>
                    </div>

                    <?php if (has_post_thumbnail()) : ?>
                        <div class="project-hero-image">
                            <?php the_post_thumbnail('large'); ?>
                        </div>
                    <?php endif; ?>

                    <div class="project-content">
                        <!-- Содержание (TOC) -->
                        <div class="sidebar">
                            <nav class="sidebar__nav">
                                <h4 class="sidebar__title">Содержание</h4>
                                <ul>
                                    <?php
                                    // Генерируем TOC из заголовков контента
                                    $content = get_the_content();
                                    $headings = [];
                                    preg_match_all('/<h([2-4])[^>]*>(.*?)<\/h[2-4]>/i', $content, $matches, PREG_SET_ORDER);

                                    if (!empty($matches)) {
                                        $counter = 1;
                                        foreach ($matches as $match) {
                                            $level = $match[1];
                                            $title = strip_tags($match[2]);
                                            $id = 'section-' . $counter;
                                            echo '<li><a href="#' . $id . '">' . $title . '</a></li>';
                                            $counter++;
                                        }
                                    } else {
                                        // Запасной вариант - показываем статические пункты
                                        echo '<li><a href="#intro">Введение</a></li>';
                                        echo '<li><a href="#content">Основное содержание</a></li>';
                                        echo '<li><a href="#conclusion">Вывод</a></li>';
                                    }
                                    ?>
                                </ul>
                            </nav>
                        </div>

                        <!-- Основной контент -->
                        <div class="content-main">
                            <?php
                            // Добавляем ID к заголовкам для якорных ссылок
                            $content = get_the_content();
                            $counter = 1;
                            $content = preg_replace_callback(
                                '/<h([2-4])[^>]*>(.*?)<\/h[2-4]>/i',
                                function($matches) use (&$counter) {
                                    $level = $matches[1];
                                    $title = $matches[2];
                                    $id = 'section-' . $counter;
                                    $counter++;
                                    return '<h' . $level . ' id="' . $id . '" class="content-section__title">' . $title . '</h' . $level . '>';
                                },
                                $content
                            );

                            // Добавляем класс content-section к секциям
                            $content = preg_replace(
                                '/<h([2-4])[^>]*id="([^"]+)"[^>]*class="([^"]*)"[^>]*>(.*?)<\/h[2-4]>/i',
                                '<div class="content-section"><h$1 id="$2" class="$3">$4</h$1>',
                                $content
                            );

                            // Закрываем div.content-section после заголовка
                            $content = preg_replace(
                                '/<div class="content-section"><h([2-4])[^>]*>(.*?)<\/h[2-4]>/i',
                                '<div class="content-section">$0',
                                $content
                            );

                            // Простой способ: оборачиваем каждый блок
                            $content = preg_replace_callback(
                                '/(<h[2-4][^>]*>.*?<\/h[2-4]>)(.*?)(?=<h[2-4]|$)/is',
                                function($matches) {
                                    return '<div class="content-section">' . $matches[0] . '</div>';
                                },
                                $content
                            );

                            echo $content;
                            ?>

                            <!-- Блок CTA в конце статьи -->
                            <div class="content-section content-section__cta">
                                <h4 class="content-section__title">Хотите настроить интеграцию для вашего бизнеса?</h4>
                                <p><strong>Поможем подключить</strong> необходимые платформы, настроить процессы и автоматизировать работу с клиентами.</p>
                                <button
                                    class="cta-button"
                                    data-controller-modal-open="form"
                                    data-controller-modal-func="open"
                                    data-controller-ripple-effect="item"
                                >
                                    Обсудить интеграцию
                                </button>
                            </div>
                        </div>

                        <!-- Похожие статьи -->
                        <div class="related-sidebar">
                            <div class="related-projects">
                                <h4 class="sidebar__title">Похожие статьи</h4>
                                <?php
                                // Получаем похожие записи по категориям
                                $categories_ids = [];
                                foreach ($categories as $category) {
                                    $categories_ids[] = $category->term_id;
                                }

                                $related_args = [
                                    'post_type' => 'post',
                                    'posts_per_page' => 3,
                                    'post__not_in' => [get_the_ID()],
                                    'orderby' => 'rand',
                                ];

                                if (!empty($categories_ids)) {
                                    $related_args['category__in'] = $categories_ids;
                                }

                                $related_query = new WP_Query($related_args);

                                if ($related_query->have_posts()) :
                                    while ($related_query->have_posts()) : $related_query->the_post();
                                        $related_reading = get_post_meta(get_the_ID(), 'reading_time', true);
                                        if (empty($related_reading)) {
                                            $related_reading = ceil(str_word_count(get_the_content()) / 200);
                                        }
                                        $related_views = get_post_meta(get_the_ID(), 'post_views', true);
                                        if (empty($related_views)) {
                                            $related_views = rand(1000, 3000);
                                        }
                                        ?>
                                        <a href="<?php the_permalink(); ?>" class="related-project">
                                            <h5 class="related-project__title"><?php the_title(); ?></h5>
                                            <p class="related-project__description"><?php echo wp_trim_words(get_the_excerpt(), 10, '...'); ?></p>
                                            <span class="related-project__meta"><?php echo $related_reading; ?> мин · <?php echo number_format($related_views); ?> просмотра</span>
                                        </a>
                                    <?php
                                    endwhile;
                                    wp_reset_postdata();
                                endif;
                                ?>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="project-form">
                <div class="form-container container">
                    <div class="form-header">
                        <h3>Хотите настроить интеграцию для вашего бизнеса? <span class="color-accent-red">Обсудим решение</span></h3>
                        <p>Поможем подключить платформы, настроить процессы и автоматизировать работу с клиентами</p>
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
                            <label for="company-project-form" class="form-label">Название компании или проекта</label>
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
                            <textarea class="form-input" name="message" id="message-project-form" placeholder=" " required rows="4"></textarea>
                            <label for="message-project-form" class="form-label">Опишите, какие платформы и каналы вы используете для общения с клиентами</label>
                        </div>

                        <div class="form-button">
                            <button class="cta-button" type="submit" data-controller-ripple-effect="item">
                                Обсудить интеграцию
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>

                        <p class="form-notice">Нажимая на кнопку, вы соглашаетесь с
                            <a href="<?php echo get_privacy_policy_url(); ?>">политикой конфиденциальности</a>. Мы ответим в течение 24 часов.
                        </p>
                    </form>
                </div>
            </section>
        </main>

    <?php
    endwhile;
endif;

get_footer();
