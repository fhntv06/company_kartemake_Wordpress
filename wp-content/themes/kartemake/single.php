<?php
/**
 * Шаблон для отдельных записей
 *
 * @package KARTMAKE
 */

get_header(); ?>

    <main class="single-content">
        <div class="scene-container">
            <article class="single-article">
                <?php while (have_posts()) : the_post(); ?>
                    <header class="single-header">
                        <h1 class="single-title"><?php the_title(); ?></h1>
                        <div class="single-meta">
                            <span><?php echo get_the_date(); ?></span>
                            <span><?php the_category(', '); ?></span>
                        </div>
                    </header>
                    <div class="single-body">
                        <?php the_content(); ?>
                    </div>
                    <footer class="single-footer">
                        <?php the_tags('<span class="single-tags">', ', ', '</span>'); ?>
                    </footer>
                <?php endwhile; ?>
            </article>
        </div>
    </main>

<?php get_footer(); ?>