<?php
/**
 * Orbit Navigation
 *
 * Централизованное управление орбитальной навигацией по страницам.
 *
 * Подключение в functions.php:
 *     require get_template_directory() . '/inc/orbit-navigation.php';
 *
 * Расширение из дочерней темы или плагина:
 *     add_filter( 'orbit_scenes_map', function ( $map ) {
 *         $map['new-page'] = [
 *             'hero'     => 'Начало',
 *             'new-main' => 'Основное',
 *         ];
 *         return $map;
 *     } );
 *
 * Использование в шаблоне:
 *     <?php render_orbit_navigation(); ?>
 *
 * @package Orbit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Карта сцен для orbit-навигации.
 *
 * Ключ верхнего уровня — slug страницы (или 'front' для главной).
 * Значение — ассоциативный массив [ id сцены => подпись ].
 *
 * @return array
 */
function get_orbit_scenes_map(): array {
    $map = [
        'front' => [
            'hero'             => 'Начало',
            'audit'            => 'Диагностика',
            'solutions'        => 'Решения',
            'architecture'     => 'Инфраструктура',
            'pipeline'         => 'Процесс',
            'cost-calculator'  => 'Калькулятор стоимости',
            'contact'          => 'Контакты',
        ],
        'about' => [
            'hero'             => 'Начало',
            'about-intro'      => 'Мы',
            'about-model'      => 'Модель',
            'about-team'       => 'Команда',
            'about-philosophy' => 'Философия',
            'about-contact'    => 'Контакты',
        ],
        'blog' => [
            'hero'           => 'Начало',
            'blog-intro'     => 'Знания',
            'blog-featured'  => 'Избранное',
            'blog-articles'  => 'Архив',
        ],
        'calculator' => [
            'hero'                => 'Начало',
            'calculator-intro'    => 'Как формируется стоимость',
            'calculator-scene'    => 'Рассчитайте стоимость',
            'calculator-contact'  => 'Готовы обсудить задачу?',
        ],
        'contacts' => [
            'hero'                => 'Начало',
            'contacts-channels'   => 'Как с нами связаться',
            'contacts-request'    => 'Ситуация, цель, проблема',
            'contacts-process'    => 'Процесс',
            'contacts-cta'        => 'Готовы обсудить задачу?',
        ],
        'services' => [
            'hero'                 => 'Начало',
            'services-wheel'       => 'Технические услуги',
            'services-partnership' => 'Партнерство',
            'services-cta'         => 'С чего начать?',
        ],
        'support' => [
            'hero'               => 'Начало',
            'support-systems'    => 'Система поддержки',
            'support-operating'  => 'Процесс поддержки',
            'support-scope'      => 'Технические операции',
            'support-task-types' => 'Контроль проблемы',
            'support-format'     => 'Стоимость',
            'support-cta'        => 'Контакты',
        ],
        'optimization' => [
            'hero'                  => 'Начало',
            'optimization-signals'  => 'Находим проблему',
            'optimization-map'      => 'Система',
            'optimization-process'  => 'Процесс',
            'optimization-scope'    => 'С чем работаем',
            'optimization-pricing'  => 'Стоимость',
            'optimization-cta'      => 'Контакты',
        ],
        'modernization' => [
            'hero'                    => 'Начало',
            'modernization-signals'   => 'Сигналы к диагностике',
            'modernization-map'       => 'Карта системы',
            'modernization-process'   => 'Процесс',
            'modernization-scope'     => 'Области работы',
            'modernization-pricing'   => 'Стоимость',
            'modernization-results'   => 'Модернизация',
            'modernization-cta'       => 'Контакты',
        ],
        'audit' => [
            'hero'           => 'Начало',
            'audit-signals'  => 'Проблемы системы',
            'audit-map'      => 'Проверка системы',
            'audit-process'  => 'Процесс',
            'audit-report'   => 'Картина системы',
            'audit-pricing'  => 'Стоимость',
            'audit-cta'      => 'С чего начать?',
        ],
        'audit-compliance-152-fz' => [
            'hero'          => 'Начало',
            'audit-signals' => 'Что проверяем',
            'audit-map'     => 'Карта рисков',
            'audit-report'  => 'Результат',
            'audit-process' => 'Этапы аудита',
            'audit-pricing' => 'Объём и стоимость',
            'audit-cta'     => 'Обсудить аудит',
        ],
        'pricing' => [
            'hero'              => 'Начало',
            'pricing-intro'     => 'Интро',
            'pricing-services'  => 'Услуги',
            'pricing-audit'     => 'Аудит',
            'pricing-advanced'  => 'Оптимизация и модернизация',
            'pricing-scope'     => 'Инжиниринг',
            'pricing-decision'  => 'Контакты',
        ],
    ];

    /**
     * Позволяет расширять карту сцен из дочерней темы или плагина.
     *
     * @param array $map Карта сцен.
     */
    return (array) apply_filters( 'orbit_scenes_map', $map );
}

/**
 * Возвращает сцены для текущей страницы.
 *
 * @return array [ id сцены => подпись ]
 */
function get_orbit_scenes(): array {
    $map = get_orbit_scenes_map();

    if ( is_front_page() ) {
        return $map['front'] ?? [];
    }

    foreach ( $map as $slug => $scenes ) {
        if ( 'front' === $slug ) {
            continue;
        }

        if ( is_page( $slug ) ) {
            /**
             * Позволяет изменить сцены конкретной страницы.
             *
             * @param array  $scenes Сцены страницы.
             * @param string $slug   Slug страницы.
             */
            return (array) apply_filters( 'orbit_scenes_for_page', $scenes, $slug );
        }
    }

    return [];
}

/**
 * Рендерит orbit-навигацию.
 *
 * @param array $args {
 *     @type string $container_id    ID контейнера.
 *     @type string $container_class Класс контейнера.
 *     @type string $circle_class    Класс круга.
 *     @type string $point_class     Класс точки.
 *     @type bool   $echo            Выводить или вернуть строку.
 * }
 * @return string|void
 */
function render_orbit_navigation( array $args = [] ) {
    $args = wp_parse_args( $args, [
        'container_id'    => 'orbit-navigation',
        'container_class' => 'orbit-navigation',
        'circle_class'    => 'orbit-circle',
        'point_class'     => 'orbit-point',
        'echo'            => true,
    ] );

    $scenes = get_orbit_scenes();

    if ( empty( $scenes ) ) {
        return '';
    }

    $number = 1;
    $points = '';

    foreach ( $scenes as $id => $label ) {
        $points .= sprintf(
            '<button class="%1$s" data-scene="%2$s">' .
            '<span class="%1$s__description">%3$s</span>' .
            '<span></span>' .
            '<strong>%4$s</strong>' .
            '</button>',
            esc_attr( $args['point_class'] ),
            esc_attr( $id ),
            esc_html( $label ),
            sprintf( '%02d', $number )
        );

        $number++;
    }

    $html = sprintf(
        '<div id="%1$s" class="%2$s"><div class="%3$s">%4$s</div></div>',
        esc_attr( $args['container_id'] ),
        esc_attr( $args['container_class'] ),
        esc_attr( $args['circle_class'] ),
        $points
    );

    if ( ! $args['echo'] ) {
        return $html;
    }

    // HTML уже экранирован по частям выше.
    echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

/**
 * Шорткод [orbit_navigation] — на случай, если нужно вставить в контент.
 *
 * @param array $atts Атрибуты шорткода.
 * @return string
 */
function orbit_navigation_shortcode( $atts ): string {
    return (string) render_orbit_navigation( [
        'echo' => false,
    ] );
}
add_shortcode( 'orbit_navigation', 'orbit_navigation_shortcode' );