<?php
/**
 * Шаблон для обычных страниц
 * Используется по умолчанию для всех страниц, если не выбран другой шаблон
 */

get_header();

if (have_posts()) :
    while (have_posts()) : the_post();
        ?>

        <article class="page-content">
            <div class="container">
                <!-- Заголовок страницы -->
                <header class="page-header">
                    <h1 class="page-title"><?php the_title(); ?></h1>
                </header>

                <!-- Основное изображение -->
                <?php if (has_post_thumbnail()) : ?>
                    <div class="page-featured-image">
                        <?php the_post_thumbnail('large'); ?>
                    </div>
                <?php endif; ?>

                <!-- Контент страницы -->
                <div class="page-body">
                    <?php the_content(); ?>

                    <?php
                    wp_link_pages([
                        'before' => '<div class="page-links">' . __('Страницы:'),
                        'after'  => '</div>',
                    ]);
                    ?>
                </div>
            </div>
        </article>

    <?php
    endwhile;
endif;

get_footer();