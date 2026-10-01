<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php get_template_part('template-parts/global/loader'); ?>
<?php get_template_part('template-parts/global/dashboard'); ?>
<?php
  if ( ! (is_page('privacy-policy') || is_page('cookie-policy') || is_404()) ) {
    render_orbit_navigation();
  }
?>
