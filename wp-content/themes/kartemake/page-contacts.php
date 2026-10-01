<?php
/**
 * Template Name: Страница "Контакты"
 * Description: Страница с контактной информацией
 */

get_header();
?>

  <main class="page contacts-page">
    <!-- CONTACT HERO -->
    <?php get_template_part('template-parts/sections/contacts/contacts-hero') ?>

    <!-- CONTACT CHANNELS -->
    <?php get_template_part('template-parts/sections/contacts/contacts-channels') ?>

    <!-- CONTACT REQUEST -->
    <?php get_template_part('template-parts/sections/contacts/contacts-request') ?>

    <!-- CONTACT CTA -->
    <?php get_template_part('template-parts/sections/contacts/contacts-cta') ?>

<?php get_footer(); ?>

