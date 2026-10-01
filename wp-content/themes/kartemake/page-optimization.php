<?php
/**
 * Template Name: Страница "Оптимизация"
 * Description: Страница с тарифами и информацией об абонентском обслуживании
 */

get_header();
?>
<main class="experience optimization-page">

  <!-- SUPPORT HERO -->
  <?php get_template_part('template-parts/sections/optimization/optimization-hero') ?>

  <!-- SUPPORT SIGNALS -->
  <?php get_template_part('template-parts/sections/optimization/optimization-signals') ?>

  <!-- SUPPORT MAP -->
  <?php get_template_part('template-parts/sections/optimization/optimization-map') ?>

  <!-- SUPPORT PROCESS -->
  <?php get_template_part('template-parts/sections/optimization/optimization-process') ?>

  <!-- SUPPORT SCOPE -->
  <?php get_template_part('template-parts/sections/optimization/optimization-scope') ?>

  <!-- SUPPORT PRICING -->
  <?php get_template_part('template-parts/sections/optimization/optimization-pricing') ?>

  <!-- SUPPORT CTA -->
  <?php get_template_part('template-parts/sections/optimization/optimization-cta') ?>


<?php get_footer(); ?>

