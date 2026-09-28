<?php
/**
 * Template Name: Страница "Блог"
 * Description: Страница со списком записей технического блога
 */

get_header();
get_template_part('template-parts/global/orbit-navigation');
?>

<main class="page page-blog">
    <?php get_template_part('template-parts/sections/blog/blog-hero'); ?>
    <?php get_template_part('template-parts/sections/blog/blog-intro'); ?>
    <?php get_template_part('template-parts/sections/blog/blog-featured'); ?>
    <?php get_template_part('template-parts/sections/blog/blog-articles'); ?>

<?php get_footer(); ?>

