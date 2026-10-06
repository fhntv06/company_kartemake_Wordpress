<?php
/**
 * Template Name: Страница "Аудит"
 * Description: Страница с тарифами и информацией об абонентском обслуживании
 */

get_header();
?>
<main class="experience audit-page">

  <!-- AUDIT HERO -->
  <?php get_template_part('template-parts/sections/audit/audit-hero') ?>

  <!-- AUDIT SYSTEMS -->
  <?php get_template_part('template-parts/sections/audit/audit-signals') ?>

  <!-- AUDIT MAP -->
  <?php get_template_part('template-parts/sections/audit/audit-map') ?>

  <!-- AUDIT PROCESS -->
  <?php get_template_part('template-parts/sections/audit/audit-process') ?>

  <!-- AUDIT REPORT -->
  <?php get_template_part('template-parts/sections/audit/audit-report') ?>

  <!-- AUDIT PRICING -->
  <?php get_template_part('template-parts/sections/audit/audit-pricing') ?>

  <!-- AUDIT CTA -->
  <?php get_template_part('template-parts/sections/audit/audit-cta') ?>

<?php get_footer(); ?>

