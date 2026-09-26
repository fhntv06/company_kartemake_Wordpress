<?php
/**
 * Настройки кастомайзера.
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('customize_register', 'kartemake_customize_register');

function kartemake_customize_register($wp_customize) {
  kartemake_customize_contacts($wp_customize);
  kartemake_customize_footer($wp_customize);
  kartemake_customize_hero($wp_customize);
  kartemake_customize_policy($wp_customize);
}

/**
 * Секция: Контакты.
 */
function kartemake_customize_contacts($wp_customize) {
  $wp_customize->add_section('kartemake_contacts', [
    'title'    => 'Контакты',
    'priority' => 30,
  ]);

  kartemake_customize_text($wp_customize, 'header_phone', 'Номер телефона в шапке', '+7 (908) 946-14-83', 'kartemake_contacts');
  kartemake_customize_email($wp_customize, 'contact_hello_email', 'Email для новых проектов', 'hello@kartemake.ru', 'kartemake_contacts');
  kartemake_customize_email($wp_customize, 'contact_support_email', 'Email техподдержки', 'support@kartemake.ru', 'kartemake_contacts');
  kartemake_customize_url($wp_customize, 'contact_telegram', 'Ссылка на Telegram', '@KArtech76', 'kartemake_contacts');
  kartemake_customize_url($wp_customize, 'contact_vk', 'Ссылка на VK', 'https://vk.ru/kartemake', 'kartemake_contacts');
}

/**
 * Секция: Подвал.
 */
function kartemake_customize_footer($wp_customize) {
  $wp_customize->add_section('kartemake_footer', [
    'title'    => 'Настройки подвала',
    'priority' => 35,
  ]);

  kartemake_customize_textarea($wp_customize, 'footer_description', 'Текст описания подвала', 'Технический партнёр для вашего бизнеса.', 'kartemake_footer');
  kartemake_customize_text($wp_customize, 'footer_copyright', 'Текст статуса в подвале', 'ВСЕ СИСТЕМЫ РАБОТАЮТ', 'kartemake_footer');
}

/**
 * Секция: Hero.
 */
function kartemake_customize_hero($wp_customize) {
  $wp_customize->add_section('kartemake_hero', [
    'title'    => 'Главная - Hero блок',
    'priority' => 20,
  ]);

  kartemake_customize_html($wp_customize, 'hero_title', 'Заголовок Hero блока (можно HTML)', 'Ваш сайт работает.<br><span>Мы отвечаем за его стабильность.</span>', 'kartemake_hero');
  kartemake_customize_textarea($wp_customize, 'hero_description', 'Текст описания в Hero блоке', 'Берём на себя технические проблемы...', 'kartemake_hero');
  kartemake_customize_text($wp_customize, 'hero_technologies', 'Список технологий (через · )', 'WordPress · 1C-Битрикс · Laravel · Next.js · Docker · Nginx', 'kartemake_hero');
}

/**
 * Секция: Политика.
 */
function kartemake_customize_policy($wp_customize) {
  $wp_customize->add_section('kartemake_policy', [
    'title'    => 'Политика конфиденциальности',
    'priority' => 40,
  ]);

  kartemake_customize_text($wp_customize, 'policy_version', 'Версия документа политики', '2.0', 'kartemake_policy');
  kartemake_customize_text($wp_customize, 'policy_date', 'Дата актуальности документа', '01.01.2026', 'kartemake_policy');
  kartemake_customize_text($wp_customize, 'policy_inn', 'ИНН', '421219133712', 'kartemake_policy');
  kartemake_customize_email($wp_customize, 'policy_email', 'Email для запросов по политике', 'privacy@kartemake.ru', 'kartemake_policy');
}

// ─── Хелперы для регистрации ─────────────────────────────

function kartemake_customize_text($wp_customize, $id, $label, $default, $section) {
  $wp_customize->add_setting($id, [
    'default'           => $default,
    'sanitize_callback' => 'sanitize_text_field',
  ]);
  $wp_customize->add_control($id, [
    'label'   => $label,
    'section' => $section,
    'type'    => 'text',
  ]);
}

function kartemake_customize_textarea($wp_customize, $id, $label, $default, $section) {
  $wp_customize->add_setting($id, [
    'default'           => $default,
    'sanitize_callback' => 'sanitize_textarea_field',
  ]);
  $wp_customize->add_control($id, [
    'label'   => $label,
    'section' => $section,
    'type'    => 'textarea',
    'rows'    => 3,
  ]);
}

function kartemake_customize_html($wp_customize, $id, $label, $default, $section) {
  $wp_customize->add_setting($id, [
    'default'           => $default,
    'sanitize_callback' => 'wp_kses_post',
  ]);
  $wp_customize->add_control($id, [
    'label'   => $label,
    'section' => $section,
    'type'    => 'textarea',
    'rows'    => 3,
  ]);
}

function kartemake_customize_email($wp_customize, $id, $label, $default, $section) {
  $wp_customize->add_setting($id, [
    'default'           => $default,
    'sanitize_callback' => 'sanitize_email',
  ]);
  $wp_customize->add_control($id, [
    'label'   => $label,
    'section' => $section,
    'type'    => 'email',
  ]);
}

function kartemake_customize_url($wp_customize, $id, $label, $default, $section) {
  $wp_customize->add_setting($id, [
    'default'           => $default,
    'sanitize_callback' => 'esc_url_raw',
  ]);
  $wp_customize->add_control($id, [
    'label'   => $label,
    'section' => $section,
    'type'    => 'url',
  ]);
}