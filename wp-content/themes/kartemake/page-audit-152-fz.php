<?php
/**
 * Template Name: Страница «Аудит сайта по 152-ФЗ»
 * Description: Аудит сайта на соответствие требованиям 152-ФЗ.
 *
 * Использует общие компоненты темы: шапку, орбитальную навигацию,
 * подвал, cookie-баннер, модальное окно и калькулятор.
 *
 * @package KARTEMAKE
 */

get_header();
?>
<main class="audit-page">
    <?php get_template_part('template-parts/sections/audit-152-fz/audit-152-fz-hero'); ?>
    <?php get_template_part('template-parts/sections/audit-152-fz/audit-152-fz-scope'); ?>
    <?php get_template_part('template-parts/sections/audit-152-fz/audit-152-fz-risk-map'); ?>
    <?php get_template_part('template-parts/sections/audit-152-fz/audit-152-fz-result'); ?>
    <?php get_template_part('template-parts/sections/audit-152-fz/audit-152-fz-process'); ?>
    <?php get_template_part('template-parts/sections/audit-152-fz/audit-152-fz-pricing'); ?>
    <?php get_template_part('template-parts/sections/audit-152-fz/audit-152-fz-cta'); ?>
<?php get_footer(); ?>
