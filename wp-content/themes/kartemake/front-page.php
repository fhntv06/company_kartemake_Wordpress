<?php
/**
 * Template Name: Главная страница
 *
 * @package KARTMAKE
 */

get_header();
get_template_part('template-parts/global/orbit-navigation');

?>
    <main class="experience">
        <!-- HERO -->
        <?php get_template_part('template-parts/sections/home/hero'); ?>

        <!-- AUDIT -->
        <?php get_template_part('template-parts/sections/home/audit'); ?>

        <!-- SOLUTIONS -->
        <?php get_template_part('template-parts/sections/home/solutions'); ?>

        <!-- ARCHITECTURE -->
        <?php get_template_part('template-parts/sections/home/architecture'); ?>

        <!-- PIPELINE -->
        <?php get_template_part('template-parts/sections/home/pipeline'); ?>

        <!-- COST CALCULATOR -->
        <?php get_template_part('template-parts/sections/home/cost-calculator'); ?>

        <!-- CONTACT -->
        <?php get_template_part('template-parts/sections/home/contact'); ?>

<?php get_footer(); ?>
