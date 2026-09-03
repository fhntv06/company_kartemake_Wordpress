<?php
/**
 * Template Name: Страница "Калькулятор"
 *
 * @package KARTMAKE
 */

get_header();
get_template_part('template-parts/global/orbit-navigation');

?>
<main class="experience calculator-page">

    <!-- CALCULATOR HERO -->
    <?php get_template_part('template-parts/sections/calculator/calculator-hero') ?>

    <!-- CALCULATOR INTRO -->
    <?php get_template_part('template-parts/sections/calculator/calculator-intro') ?>

    <!-- CALCULATOR SCENE -->
    <?php get_template_part('template-parts/sections/calculator/calculator-scene') ?>

    <!-- CALCULATOR CONTACT -->
    <?php get_template_part('template-parts/sections/calculator/calculator-contact') ?>

<?php get_footer(); ?>
