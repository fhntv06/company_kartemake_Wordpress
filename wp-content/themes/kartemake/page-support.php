<?php
/**
 * Template Name: Страница "Техподдержка"
 * Description: Страница с тарифами и информацией об абонентском обслуживании
 */

get_header();
?>
<main class="experience support-page">

  <!-- SUPPORT HERO -->
  <?php get_template_part('template-parts/sections/support/support-hero') ?>

  <!-- SUPPORT SYSTEMS -->
  <?php get_template_part('template-parts/sections/support/support-systems') ?>

  <!-- SUPPORT OPERATING -->
  <?php get_template_part('template-parts/sections/support/support-operating') ?>

  <!-- SUPPORT SCOPE -->
  <?php get_template_part('template-parts/sections/support/support-scope') ?>

  <!-- SUPPORT SCOPE -->
  <?php get_template_part('template-parts/sections/support/support-task') ?>

  <!-- SUPPORT FORMAT -->
  <?php get_template_part('template-parts/sections/support/support-format') ?>

  <!-- SUPPORT CTA -->
  <?php get_template_part('template-parts/sections/support/support-cta') ?>

<?php get_footer(); ?>

