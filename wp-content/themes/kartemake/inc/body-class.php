<?php
/**
 * Фильтр body_class.
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
  exit;
}

add_filter('body_class', 'kartemake_body_class');

function kartemake_body_class($classes) {
  if (is_front_page()) {
    $classes[] = 'page-home';
  }
  if (is_page('privacy-policy') || is_page('cookie-policy')) {
    $classes[] = 'privacy-policy';
  }
  if (is_home() || is_page('blog') || is_page_template('page-blog.php')) {
    $classes[] = 'blog-page';
  }
  if (is_single()) {
    $classes[] = 'single-post';
  }
  if (is_page('services') || is_page_template('page-services.php')) {
    $classes[] = 'services-page';
  }
  if (is_page('contacts') || is_page_template('page-contacts.php')) {
    $classes[] = 'contacts-page';
  }
  return $classes;
}