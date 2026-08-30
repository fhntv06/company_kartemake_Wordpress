<?php
/**
 * Template Name: Страница "Блог"
 * Description: Страница со списком записей технического блога
 */

get_header();
get_template_part('template-parts/global/orbit-navigation');
?>

<main class="page page-blog">
    <!-- Hero -->
    <?php get_template_part('template-parts/sections/blog/blog-hero'); ?>

    <!-- INTRO -->
    <?php get_template_part('template-parts/sections/blog/blog-intro'); ?>

    <!-- FEATURED -->
    <?php get_template_part('template-parts/sections/blog/blog-featured'); ?>

    <!-- ARTICLES -->
    <?php get_template_part('template-parts/sections/blog/blog-articles'); ?>


<?php get_footer(); ?>

