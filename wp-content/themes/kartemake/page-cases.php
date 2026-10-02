<?php
/**
 * Template Name: Страница "Кейсы"
 * Description: Страница со списком записей технического блога
 */

get_header();

?>

<main class="page cases-page">
    <!-- CASES HERO -->
    <?php get_template_part('template-parts/sections/cases/cases-hero'); ?>

    <!-- CASES FEATURED -->
    <?php get_template_part('template-parts/sections/cases/cases-featured'); ?>

    <!-- CASES ARCHIVE -->
    <?php get_template_part('template-parts/sections/cases/cases-archive'); ?>

<?php get_footer(); ?>

