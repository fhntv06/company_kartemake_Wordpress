<?php
/**
 * Обработка форм.
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('admin_post_kartemake_submit_form', 'kartemake_handle_form_submission');
add_action('admin_post_nopriv_kartemake_submit_form', 'kartemake_handle_form_submission');

/**
 * Обработка отправки формы с сайта.
 */
function kartemake_handle_form_submission() {
  // Nonce
  if (!isset($_POST['kartemake_nonce']) || !wp_verify_nonce($_POST['kartemake_nonce'], 'kartemake_form_submit')) {
    wp_die('Ошибка безопасности');
  }

  // Поля
  $name    = sanitize_text_field($_POST['name'] ?? '');
  $company = sanitize_text_field($_POST['company'] ?? '');
  $email   = sanitize_email($_POST['email'] ?? '');
  $phone   = sanitize_text_field($_POST['phone'] ?? '');
  $message = sanitize_textarea_field($_POST['message'] ?? '');
  $type    = sanitize_text_field($_POST['type'] ?? '');
  $urgent  = isset($_POST['urgent']) ? 'Да' : 'Нет';

  // Валидация
  if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    wp_die('Заполните все обязательные поля');
  }

  // Письмо
  $to      = get_option('admin_email');
  $subject = 'Новая заявка с сайта KARTMAKE';
  $body    = "Имя: $name\n";
  $body   .= "Компания: $company\n";
  $body   .= "Email: $email\n";
  $body   .= "Телефон: $phone\n";
  $body   .= "Тип задачи: $type\n";
  $body   .= "Срочная: $urgent\n";
  $body   .= "Сообщение: $message\n";

  $headers = ['Content-Type: text/plain; charset=UTF-8'];

  wp_mail($to, $subject, $body, $headers);

  // Редирект
  wp_redirect(add_query_arg('form_sent', 'success', wp_get_referer()));
  exit;
}