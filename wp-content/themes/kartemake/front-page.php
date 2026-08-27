<?php
/**
 * Template Name: Главная страница
 *
 * @package KARTMAKE
 */

get_header(); ?>

    <main class="experience">
        <!-- HERO -->
        <?php get_template_part('template-parts/sections/hero'); ?>

        <!-- AUDIT -->
        <?php get_template_part('template-parts/sections/audit'); ?>

        <!-- SOLUTIONS -->
        <?php get_template_part('template-parts/sections/solutions'); ?>

        <!-- ARCHITECTURE -->
        <?php get_template_part('template-parts/sections/architecture'); ?>

        <!-- PIPELINE -->
        <?php get_template_part('template-parts/sections/pipeline'); ?>

        <!-- MONITORING -->
        <?php get_template_part('template-parts/sections/monitoring'); ?>

        <!-- CONTACT -->
        <?php get_template_part('template-parts/sections/contact'); ?>
    </main>

<?php get_footer(); ?>