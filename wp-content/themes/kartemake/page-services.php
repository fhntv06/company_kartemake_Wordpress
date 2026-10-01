<?php
/**
 * Template Name: Страница "Услуги"
 * Description: Страница с перечнем услуг
 */

get_header();
?>

  <main class="page services-page">
    <!-- SERVICES HERO -->
    <?php get_template_part('template-parts/sections/services/services-hero') ?>

    <!-- SERVICES WHEEL -->
    <?php get_template_part('template-parts/sections/services/services-wheel') ?>

    <!-- SERVICES PARTNERSHIP -->
    <?php get_template_part('template-parts/sections/services/services-partnership') ?>

    <!-- SERVICES CTA -->
    <?php get_template_part('template-parts/sections/services/services-cta') ?>

<?php get_footer(); ?>