<?php
/**
 * Шаблон для обычных страниц
 *
 * @package KARTMAKE
 */

get_header(); ?>

    <main class="page-content">
        <div class="scene-container">
            <div class="page-wrapper">
                <?php while (have_posts()) : the_post(); ?>
                    <header class="page-header">
                        <h1 class="page-title"><?php the_title(); ?></h1>
                    </header>
                    <div class="page-body">
                        <?php the_content(); ?>
                    </div>
                <?php endwhile; ?>
            </div>
        </div>

<?php get_footer(); ?>