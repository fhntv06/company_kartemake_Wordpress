<?php
/**
 * Tag archive
 *
 * @package KARTEMAKE
 */

get_header();
?>
  <main class="tag-page">
    <?php get_template_part('template-parts/sections/tag/tag-hero'); ?>
    <?php get_template_part('template-parts/sections/tag/tag-articles'); ?>

<?php get_footer() ?>