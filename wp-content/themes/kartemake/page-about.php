<?php
/**
 * Template Name: Страница "О нас"
 *
 * @package KARTMAKE
 */

get_header();
?>
    <main class="experience about-page">
        <!-- ABOUT HERO -->
        <?php get_template_part('template-parts/sections/about/about-hero') ?>

        <!-- ABOUT INTRO -->
        <?php get_template_part('template-parts/sections/about/about-intro') ?>

        <!-- ABOUT MODEL -->
        <?php get_template_part('template-parts/sections/about/about-model') ?>

        <!-- ABOUT TEAM -->
        <?php get_template_part('template-parts/sections/about/about-team') ?>

        <!-- ABOUT PHILOSOPHY -->
        <?php get_template_part('template-parts/sections/about/about-philosophy') ?>

        <!-- ABOUT CONTACT -->
        <?php get_template_part('template-parts/sections/about/about-contact') ?>

<?php get_footer(); ?>
