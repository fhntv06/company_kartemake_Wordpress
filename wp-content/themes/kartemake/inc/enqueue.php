<?php
/**
 * K·ART·MAKE — подключение скриптов и стилей
 *
 * Единый источник истины — kartemake_get_pages_map().
 *
 * Порядок загрузки:
 *   runtime → vendors → npm → global → <page>
 *
 * Дефолтное правило для страницы:
 *   is_page('<slug>') || is_page_template('page-<slug>.php')
 *
 * Особые случаи задаются явно:
 *   ['type' => 'front']   → is_front_page()
 *   ['type' => 'home']    → is_home()
 *   ['type' => 'single']  → is_single()
 *
 * Переопределение дефолта:
 *   ['pages' => [...], 'templates' => [...], 'extra' => fn]
 *
 * @package KARTMAKE
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Карта страниц.
 *
 * Ключ  — имя чанка (совпадает с entry в webpack.config.js).
 * Значение:
 *   null                            → дефолт (is_page + is_page_template)
 *   ['type' => 'front'|'home'|'single'] → особый случай
 *   ['pages' => [...], 'templates' => [...], 'extra' => callable]
 *                                    → переопределение
 *
 * Порядок в массиве = порядок проверки.
 */
function kartemake_get_pages_map() {
  return [
    // ── Особые случаи ──────────────────────────────────
    'home'         => ['type' => 'front'],
    'blog'         => ['type' => 'home'],
    'single'       => ['type' => 'single'],

    // ── Дефолт: is_page(slug) || is_page_template(page-slug.php) ──
    'about'        => null,
    'contacts'     => null,
    'calculator'   => null,
    'services'     => null,
    'support'      => null,
    'optimization' => null,
    'modernization'=> null,
    'audit'        => null,
    'pricing'      => null,

    // ── Переопределения ────────────────────────────────
    // policy: один чанк на две страницы
    'policy' => [
      'pages' => ['privacy-policy', 'cookie-policy'],
    ],
  ];
}

/**
 * Проверяет, подходит ли текущая страница под правило.
 *
 * @param string $slug  Имя чанка (= ключ в карте).
 * @param mixed  $rule  null | array с 'type' | array с 'pages'/'templates'/'extra'
 * @return bool
 */
function kartemake_match_page($slug, $rule) {
  // ── Особый тип ────────────────────────────────────────
  if (is_array($rule) && isset($rule['type'])) {
    switch ($rule['type']) {
      case 'front':  return is_front_page();
      case 'home':   return is_home();
      case 'single': return is_single();
    }
    return false;
  }

  // ── Переопределение: pages / templates / extra ────────
  if (is_array($rule)) {
    if (!empty($rule['pages'])) {
      foreach ($rule['pages'] as $page_slug) {
        if (is_page($page_slug)) return true;
      }
    }
    if (!empty($rule['templates'])) {
      foreach ($rule['templates'] as $tpl) {
        if (is_page_template($tpl)) return true;
      }
    }
    if (!empty($rule['extra']) && is_callable($rule['extra'])) {
      if (call_user_func($rule['extra'])) return true;
    }
    return false;
  }

  // ── Дефолт ────────────────────────────────────────────
  return is_page($slug) || is_page_template("page-{$slug}.php");
}

/**
 * Подключение общих и страничных чанков.
 */
function kartemake_enqueue_scripts() {
  $theme_uri = get_template_directory_uri();
  $theme_dir = get_template_directory();
  $version   = wp_get_theme()->get('Version');

  // ── 1. Общие чанки ────────────────────────────────────
  wp_enqueue_script(
    'kartemake-js-runtime',
    $theme_uri . '/assets/js/runtime.build.js',
    [],
    $version,
    true
  );

  wp_enqueue_script(
    'kartemake-js-vendors',
    $theme_uri . '/assets/js/vendors.build.js',
    ['kartemake-js-runtime'],
    $version,
    true
  );

  // npm — подключаем только если файл реально собран
  if (file_exists($theme_dir . '/assets/js/npm.build.js')) {
    wp_enqueue_script(
      'kartemake-js-npm',
      $theme_uri . '/assets/js/npm.build.js',
      ['kartemake-js-runtime'],
      $version,
      true
    );
  }

  wp_enqueue_script(
    'kartemake-js-global',
    $theme_uri . '/assets/js/global.build.js',
    ['kartemake-js-vendors'],
    $version,
    true
  );

  wp_enqueue_style(
    'kartemake-style-global',
    $theme_uri . '/assets/css/global.build.css',
    [],
    $version
  );

  // ── 2. Страничный чанк ────────────────────────────────
  foreach (kartemake_get_pages_map() as $slug => $rule) {
    if (!kartemake_match_page($slug, $rule)) {
      continue;
    }

    $js  = $theme_dir . "/assets/js/{$slug}.build.js";
    $css = $theme_dir . "/assets/css/{$slug}.build.css";

    if (file_exists($js)) {
      wp_enqueue_script(
        "kartemake-js-{$slug}",
        $theme_uri . "/assets/js/{$slug}.build.js",
        ['kartemake-js-global'],
        $version,
        true
      );
    }

    if (file_exists($css)) {
      wp_enqueue_style(
        "kartemake-style-{$slug}",
        $theme_uri . "/assets/css/{$slug}.build.css",
        [],
        $version
      );
    }

    break; // первое совпадение — выходим.
    // Если нужно несколько чанков на страницу — уберите break.
  }
}
add_action('wp_enqueue_scripts', 'kartemake_enqueue_scripts');