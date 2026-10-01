<?php
/**
 * Template Name: Страница "Форматы работы"
 * Description: Страница с описанием как происходит работа и со всеми ценами на работы
 */

get_header();
?>
<main class="experience pricing-page">

    <!-- PRICING HERO -->
    <?php get_template_part('template-parts/sections/pricing/pricing-hero') ?>

    <!-- PRICING INTRO -->
    <?php get_template_part('template-parts/sections/pricing/pricing-intro') ?>
    
    <!-- PRICING SERVICES -->
    <?php get_template_part('template-parts/sections/pricing/pricing-services') ?>
    
    <!-- PRICING AUDIT -->
    <?php get_template_part('template-parts/sections/pricing/pricing-audit') ?>
    
    <!-- PRICING ADVANCED -->
    <?php get_template_part('template-parts/sections/pricing/pricing-advanced') ?>
    
    <!-- PRICING SCOPE -->
    <?php get_template_part('template-parts/sections/pricing/pricing-scope') ?>
    
    <!-- PRICING DECISION -->
    <?php get_template_part('template-parts/sections/pricing/pricing-decision') ?>

<?php get_footer(); ?>

