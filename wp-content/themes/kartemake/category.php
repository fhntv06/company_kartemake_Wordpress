<?php
/**
 * Шаблон страницы рубрики (category)
 *
 * @package KARTMAKE
 */

get_header();
?>
  <main class="page page-category">
    <?php get_template_part('template-parts/sections/category/category-hero'); ?>
    <?php get_template_part('template-parts/sections/category/category-articles'); ?>

<?php get_footer(); ?>