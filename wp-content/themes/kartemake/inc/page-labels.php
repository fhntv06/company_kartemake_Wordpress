<?php
/**
 * Подписи прелоадера (system-loader) и статуса в global-dashboard по страницам.
 *
 * Файл: inc/page-labels.php
 * Подключение: functions.php → require_once $kartemake_inc . 'page-labels.php';
 *
 * Использование в шаблонах:
 *   $labels = kartemake_get_page_labels();
 *   $labels['loader']  // текст прелоадера
 *   $labels['status']  // текст рядом с индикатором в global-dashboard
 *
 * Тексты менять только в kartemake_page_labels_map(). Рекомендуемая длина:
 * loader до ~28 символов, status до ~24 символов, чтобы не ломать вёрстку на мобильных.
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Карта подписей. Ключ — slug страницы или служебный ключ (см. kartemake_get_page_key()).
 */
function kartemake_page_labels_map() {
    return [
        // Значения по умолчанию
        'default'       => ['loader' => 'ЗАПУСК СИСТЕМЫ K·ART·MAKE', 'status' => 'СИСТЕМА РАБОТАЕТ'],

        // Главная и блог
        'home'          => ['loader' => 'ЗАПУСК СИСТЕМЫ K·ART·MAKE',  'status' => 'СИСТЕМА РАБОТАЕТ'],
        'blog'          => ['loader' => 'ЗАГРУЗКА ПУБЛИКАЦИЙ',       'status' => 'АРХИВ ДОСТУПЕН'],
        'single-post'   => ['loader' => 'ЗАГРУЗКА СТАТЬИ',           'status' => 'РЕЖИМ ЧТЕНИЯ'],
        'archive'       => ['loader' => 'СОРТИРОВКА ПУБЛИКАЦИЙ',     'status' => 'РУБРИКА ЗАГРУЖЕНА'],

        // Кейсы
        'cases'         => ['loader' => 'ЗАГРУЗКА КЕЙСОВ',           'status' => 'АРХИВ КЕЙСОВ ОТКРЫТ'],
        'single-cases'  => ['loader' => 'ЗАГРУЗКА КЕЙСА',            'status' => 'КЕЙС ОТКРЫТ'],

        // Компания и услуги
        'about'         => ['loader' => 'ЗАГРУЗКА ПРОФИЛЯ КОМПАНИИ', 'status' => 'ПРОФИЛЬ ЗАГРУЖЕН'],
        'services'      => ['loader' => 'СКАНИРОВАНИЕ КАТАЛОГА УСЛУГ', 'status' => 'КАТАЛОГ ДОСТУПЕН'],
        'pricing'       => ['loader' => 'ЗАГРУЗКА ФОРМАТОВ РАБОТЫ',  'status' => 'ФОРМАТЫ АКТУАЛЬНЫ'],
        'optimization'  => ['loader' => 'ЗАПУСК ОПТИМИЗАЦИИ',        'status' => 'ОПТИМИЗАЦИЯ АКТИВНА'],
        'modernization' => ['loader' => 'ИНИЦИАЛИЗАЦИЯ МОДЕРНИЗАЦИИ', 'status' => 'МОДЕРНИЗАЦИЯ В РАБОТЕ'],
        'support'       => ['loader' => 'ПОДКЛЮЧЕНИЕ К ПОДДЕРЖКЕ',   'status' => 'ПОДДЕРЖКА НА СВЯЗИ'],
        'audit'         => ['loader' => 'ЗАПУСК ДИАГНОСТИКИ САЙТА',  'status' => 'ДИАГНОСТИКА АКТИВНА'],
        'audit-compliance-152-fz' => ['loader' => 'ПРОВЕРКА СООТВЕТСТВИЯ 152-ФЗ', 'status' => 'КОНТРОЛЬ 152-ФЗ АКТИВЕН'],
        'calculator'    => ['loader' => 'ЗАГРУЗКА КАЛЬКУЛЯТОРА',     'status' => 'РАСЧЁТ ГОТОВ'],
        'contacts'      => ['loader' => 'УСТАНОВКА СВЯЗИ',           'status' => 'КАНАЛ СВЯЗИ ОТКРЫТ'],

        // Документы
        'privacy-policy'   => ['loader' => 'ЗАГРУЗКА ПОЛИТИКИ ДАННЫХ',  'status' => 'ДОКУМЕНТ ДОСТУПЕН'],
        'cookie-policy'    => ['loader' => 'ЗАГРУЗКА ПОЛИТИКИ COOKIE',  'status' => 'ДОКУМЕНТ ДОСТУПЕН'],
        'agreement-policy' => ['loader' => 'ЗАГРУЗКА СОГЛАСИЯ',         'status' => 'ДОКУМЕНТ ДОСТУПЕН'],

        // Ошибка
        '404'           => ['loader' => 'ПОИСК СТРАНИЦЫ',            'status' => 'СТРАНИЦА НЕ НАЙДЕНА'],
    ];
}

/**
 * Определить ключ текущей страницы для карты подписей.
 */
function kartemake_get_page_key() {
    if (is_404()) {
        return '404';
    }
    if (is_front_page()) {
        return 'home';
    }
    if (is_home()) {
        return 'blog';
    }
    if (is_singular('cases')) {
        return 'single-cases';
    }
    if (is_single()) {
        return 'single-post';
    }
    if (is_archive()) { // категории, метки, прочие архивы
        return 'archive';
    }
    if (is_page()) {
        $slug = get_post_field('post_name', get_queried_object_id());
        return $slug ? $slug : 'default';
    }

    return 'default';
}

/**
 * Подписи для текущей страницы.
 *
 * @return array{loader:string,status:string}
 */
function kartemake_get_page_labels() {
    $map = kartemake_page_labels_map();
    $key = kartemake_get_page_key();

    $labels = wp_parse_args(isset($map[$key]) ? $map[$key] : [], $map['default']);

    /**
     * Позволяет переопределить подписи из плагина или дочерней темы.
     */
    return apply_filters('kartemake_page_labels', $labels, $key);
}
