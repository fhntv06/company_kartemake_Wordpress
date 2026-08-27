<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-page="<?php echo is_front_page() ? 'home' : 'page'; ?>">
<?php wp_body_open(); ?>

<!-- =================================================
SYSTEM LOADER
================================================= -->
<?php get_template_part('template-parts/global/loader'); ?>

<!-- =================================================
ORBIT NAVIGATION
================================================= -->
<?php if (is_front_page()) : ?>
    <?php get_template_part('template-parts/global/orbit-navigation'); ?>
<?php endif; ?>

<!-- =================================================
GLOBAL DASHBOARD
================================================= -->
<?php get_template_part('template-parts/global/dashboard'); ?>