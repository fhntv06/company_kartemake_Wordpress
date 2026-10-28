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
        <!-- AUDIT 152 FZ HERO -->
        <?php get_template_part('template-parts/sections/audit-compliance-152-fz/audit-compliance-152-fz-hero'); ?>

        <!-- AUDIT 152 FZ SCOPE -->
        <?php get_template_part('template-parts/sections/audit-compliance-152-fz/audit-compliance-152-fz-scope'); ?>

        <!-- AUDIT 152 FZ RISK MAP -->
        <?php get_template_part('template-parts/sections/audit-compliance-152-fz/audit-compliance-152-fz-risk-map'); ?>

        <!-- AUDIT 152 FZ RESULT -->
        <?php get_template_part('template-parts/sections/audit-compliance-152-fz/audit-compliance-152-fz-result'); ?>

        <!-- AUDIT 152 FZ PROCESS -->
        <?php get_template_part('template-parts/sections/audit-compliance-152-fz/audit-compliance-152-fz-process'); ?>

        <!-- AUDIT 152 FZ PRICING -->
        <?php get_template_part('template-parts/sections/audit-compliance-152-fz/audit-compliance-152-fz-pricing'); ?>

        <!-- AUDIT 152 FZ CTA -->
        <?php get_template_part('template-parts/sections/audit-compliance-152-fz/audit-compliance-152-fz-cta'); ?>

<?php get_footer(); ?>
