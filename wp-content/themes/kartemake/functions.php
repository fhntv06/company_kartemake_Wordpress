<?php
/**
 * Функции темы KARTMAKE
 *
 * @package Kartemake
 */

// ============================================
// 1. НАСТРОЙКИ ТЕМЫ
// ============================================

/**
 * Подключение файла отключения эмодзи
 */

require_once get_template_directory() . '/inc/disabled-wp-emoji.php';

/**
 * Регистрация меню
 */
register_nav_menus([
    'header-menu'   => 'Главное меню в шапке',
    'footer-menu'   => 'Меню блок "Полезное"',
    'privacy-menu'  => 'Правовая информация блок "Полезное"',
    'services-menu' => 'Меню блок "Услуги"',
]);

/**
 * Поддержка стандартных фич WordPress
 */
add_theme_support('title-tag');
add_theme_support('post-thumbnails');
add_theme_support('html5', [
    'comment-list',
    'comment-form',
    'search-form',
    'gallery',
    'caption',
]);
add_theme_support('post-formats', ['video', 'gallery', 'audio']);

/**
 * Добавляем поддержку шаблонов страниц
 */
function kartmake_page_template_include($templates) {
    $templates['page-privacy-policy.php'] = __('Политика использования', 'kartmake');
    $templates['page-cookie-policy.php'] = __('Политика Cookie', 'kartmake');
    return $templates;
}
add_filter('theme_page_templates', 'kartmake_page_template_include');

// ============================================
// 2. ПОДКЛЮЧЕНИЕ ФАЙЛОВ
// ============================================

/**
 * Подключаем вспомогательные файлы
 */
require_once get_template_directory() . '/inc/controllers.php';

// ============================================
// 3. СТИЛИ И СКРИПТЫ
// ============================================

/**
 * Подключение стилей и скриптов
 */
function kartemake_enqueue_scripts() {
    // Основной CSS
//    wp_enqueue_style('kartemake-style', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));

    // Порядок подключения скриптов
    // - runtime.build.js
    // - vendors.build.js
    // - pages-common.build.js
    // - global.build.js
    // - other pages sceripts


    // Основные скрипты
    // runtime
    wp_enqueue_script(
        'kartemake-js-runtime',
        get_template_directory_uri() . '/assets/js/runtime.build.js',
        array(),
        wp_get_theme()->get('Version'),
        true
    );
    // vendors
    wp_enqueue_script(
        'kartemake-js-vendors',
        get_template_directory_uri() . '/assets/js/vendors.build.js',
        array('kartemake-js-runtime'),
        wp_get_theme()->get('Version'),
        true
    );

    // Общий JS
    // global
    wp_enqueue_script(
        'kartemake-js-global',
        get_template_directory_uri() . '/assets/js/global.build.js',
        [],
        wp_get_theme()->get('Version'),
        true
    );
    wp_enqueue_style(
        'kartemake-style-global',
        get_template_directory_uri() . '/assets/css/global.build.css',
        [],
        wp_get_theme()->get('Version')
    );

    // pages-common
    if (
        is_front_page()
        || is_page('about')
        || is_page('calculator')
        || is_page('contacts')
        || is_page('services')
        || is_page('blog') || is_home()
        || is_page('support') // TODO: уже уперся в проблему с разделением модулей
        || is_page('optimization')
        || is_page('modernization')
        || is_page('audit')
    ) {
        wp_enqueue_script(
            'kartemake-js-pages-common',
            get_template_directory_uri() . '/assets/js/pages-common.build.js',
            array('kartemake-js-vendors'),
            wp_get_theme()->get('Version'),
            true
        );
    }

    // Главная страница
    if (is_front_page()) {
        // home
        wp_enqueue_script(
            'kartemake-js-home',
            get_template_directory_uri() . '/assets/js/home.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-home',
            get_template_directory_uri() . '/assets/css/home.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страницы about
    if (is_page('about')) {
        // about
        wp_enqueue_script(
            'kartemake-js-about',
            get_template_directory_uri() . '/assets/js/about.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-about',
            get_template_directory_uri() . '/assets/css/about.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страницы политик
    if (is_page('privacy-policy') || is_page('cookie-policy')) {
        // policy
        wp_enqueue_script(
            'kartemake-js-policy',
            get_template_directory_uri() . '/assets/js/policy.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-policy',
            get_template_directory_uri() . '/assets/css/policy.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страница контактов
    // contacts
    if (is_page('contacts') || is_page_template('page-contacts.php')) {
        wp_enqueue_script(
            'kartemake-js-contacts',
            get_template_directory_uri() . '/assets/js/contacts.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-contacts',
            get_template_directory_uri() . '/assets/css/contacts.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страница блога
    // blog
    if (is_home() || is_page('blog') || is_page_template('page-blog.php')) {
        wp_enqueue_script(
            'kartemake-js-blog',
            get_template_directory_uri() . '/assets/js/blog.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-blog',
            get_template_directory_uri() . '/assets/css/blog.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страница Калькулятора
    // calculator
    if (is_page('calculator') || is_page_template('page-calculator.php')) {
        wp_enqueue_script(
            'kartemake-js-calculator',
            get_template_directory_uri() . '/assets/js/calculator.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-calculator',
            get_template_directory_uri() . '/assets/css/calculator.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страница Услуги
    // services
    if (is_page('services') || is_page_template('page-services.php')) {
        wp_enqueue_script(
            'kartemake-js-services',
            get_template_directory_uri() . '/assets/js/services.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-services',
            get_template_directory_uri() . '/assets/css/services.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Отдельная запись
    if (is_single()) {
        wp_enqueue_script(
            'kartemake-js-single',
            get_template_directory_uri() . '/assets/js/single.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-single',
            get_template_directory_uri() . '/assets/css/single.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страница услуг
    // support
    if (is_page('support') || is_page_template('page-support.php')) {
        wp_enqueue_script(
            'kartemake-js-support',
            get_template_directory_uri() . '/assets/js/support.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-support',
            get_template_directory_uri() . '/assets/css/support.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страница услуг
    // optimization
    if (is_page('optimization') || is_page_template('page-optimization.php')) {
        wp_enqueue_script(
            'kartemake-js-optimization',
            get_template_directory_uri() . '/assets/js/optimization.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-optimization',
            get_template_directory_uri() . '/assets/css/optimization.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страница услуг
    // modernization
    if (is_page('modernization') || is_page_template('page-modernization.php')) {
        wp_enqueue_script(
            'kartemake-js-optimization',
            get_template_directory_uri() . '/assets/js/modernization.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-optimization',
            get_template_directory_uri() . '/assets/css/modernization.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    // Страница услуг
    // modernization
    if (is_page('audit') || is_page_template('page-audit.php')) {
        wp_enqueue_script(
            'kartemake-js-audit',
            get_template_directory_uri() . '/assets/js/audit.build.js',
            array('kartemake-js-global'),
            wp_get_theme()->get('Version'),
            true
        );
        wp_enqueue_style(
            'kartemake-style-audit',
            get_template_directory_uri() . '/assets/css/audit.build.css',
            [],
            wp_get_theme()->get('Version')
        );
    }
}
add_action('wp_enqueue_scripts', 'kartemake_enqueue_scripts');

// ============================================
// 4. МЕНЮ: АКТИВНЫЙ КЛАСС
// ============================================

/**
 * Добавляем класс active для текущего пункта меню
 */
add_filter('nav_menu_link_attributes', function($atts, $item, $args) {
    if ($args->theme_location === 'header-menu') {
        if ($item->current || $item->current_item_parent) {
            $atts['class'] = 'active';
        }
    }
    return $atts;
}, 10, 3);

/**
 * Убираем лишние классы у меню
 */
add_filter('nav_menu_css_class', function($classes, $item, $args) {
    if ($args->theme_location === 'header-menu') {
        return array_filter($classes, function($class) {
            return !in_array($class, ['menu-item', 'current-menu-item', 'current-page-parent']);
        });
    }
    return $classes;
}, 10, 3);

// ============================================
// 5. НАСТРОЙКИ КАСТОМАЙЗЕРА
// ============================================

/**
 * Настройки темы через кастомайзер
 */
add_action('customize_register', function($wp_customize) {

    // -------- Секция: Контакты --------
    $wp_customize->add_section('kartemake_contacts', [
        'title'    => 'Контакты',
        'priority' => 30,
    ]);

    // Телефон в шапке
    $wp_customize->add_setting('header_phone', [
        'default'           => '+7 (908) 946-14-83',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('header_phone', [
        'label'   => 'Номер телефона в шапке',
        'section' => 'kartemake_contacts',
        'type'    => 'text',
    ]);

    // Email для новых проектов
    $wp_customize->add_setting('contact_hello_email', [
        'default'           => 'hello@kartemake.ru',
        'sanitize_callback' => 'sanitize_email',
    ]);
    $wp_customize->add_control('contact_hello_email', [
        'label'   => 'Email для новых проектов',
        'section' => 'kartemake_contacts',
        'type'    => 'email',
    ]);

    // Email для поддержки
    $wp_customize->add_setting('contact_support_email', [
        'default'           => 'support@kartemake.ru',
        'sanitize_callback' => 'sanitize_email',
    ]);
    $wp_customize->add_control('contact_support_email', [
        'label'   => 'Email техподдержки',
        'section' => 'kartemake_contacts',
        'type'    => 'email',
    ]);

    // Telegram
    $wp_customize->add_setting('contact_telegram', [
        'default'           => 'https://t.me/KArtech76',
        'sanitize_callback' => 'esc_url_raw',
    ]);
    $wp_customize->add_control('contact_telegram', [
        'label'   => 'Ссылка на Telegram',
        'section' => 'kartemake_contacts',
        'type'    => 'url',
    ]);

    // VK
    $wp_customize->add_setting('contact_vk', [
        'default'           => 'https://vk.ru/kartemake',
        'sanitize_callback' => 'esc_url_raw',
    ]);
    $wp_customize->add_control('contact_vk', [
        'label'   => 'Ссылка на VK',
        'section' => 'kartemake_contacts',
        'type'    => 'url',
    ]);

    // -------- Секция: Подвал --------
    $wp_customize->add_section('kartemake_footer', [
        'title'    => 'Настройки подвала',
        'priority' => 35,
    ]);

    // Текст описания в подвале
    $wp_customize->add_setting('footer_description', [
        'default'           => 'Технический партнёр для вашего бизнеса.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ]);
    $wp_customize->add_control('footer_description', [
        'label'   => 'Текст описания подвала',
        'section' => 'kartemake_footer',
        'type'    => 'textarea',
        'rows'    => 3,
    ]);

    // Текст копирайта
    $wp_customize->add_setting('footer_copyright', [
        'default'           => 'ВСЕ СИСТЕМЫ РАБОТАЮТ',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_copyright', [
        'label'   => 'Текст статуса в подвале',
        'section' => 'kartemake_footer',
        'type'    => 'text',
    ]);

    // -------- Секция: Главная - Hero --------
    $wp_customize->add_section('kartemake_hero', [
        'title'    => 'Главная - Hero блок',
        'priority' => 20,
    ]);

    // Заголовок Hero
    $wp_customize->add_setting('hero_title', [
        'default'           => 'Ваш сайт работает.<br><span>Мы отвечаем за его стабильность.</span>',
        'sanitize_callback' => 'wp_kses_post',
    ]);
    $wp_customize->add_control('hero_title', [
        'label'   => 'Заголовок Hero блока (можно использовать HTML)',
        'section' => 'kartemake_hero',
        'type'    => 'textarea',
        'rows'    => 3,
    ]);

    // Описание Hero
    $wp_customize->add_setting('hero_description', [
        'default'           => 'Берём на себя технические проблемы вашего сайта и инфраструктуры: находим узкие места, устраняем ошибки, ускоряем работу и поддерживаем систему в рабочем состоянии.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ]);
    $wp_customize->add_control('hero_description', [
        'label'   => 'Текст описания в Hero блоке',
        'section' => 'kartemake_hero',
        'type'    => 'textarea',
        'rows'    => 4,
    ]);

    // Технологии в Hero
    $wp_customize->add_setting('hero_technologies', [
        'default'           => 'WordPress · 1C-Битрикс · Laravel · Next.js · Docker · Nginx',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('hero_technologies', [
        'label'   => 'Список технологий (через · )',
        'section' => 'kartemake_hero',
        'type'    => 'text',
    ]);

    // -------- Секция: Политика --------
    $wp_customize->add_section('kartemake_policy', [
        'title'    => 'Политика конфиденциальности',
        'priority' => 40,
    ]);

    // Версия документа
    $wp_customize->add_setting('policy_version', [
        'default'           => '2.0',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('policy_version', [
        'label'   => 'Версия документа политики',
        'section' => 'kartemake_policy',
        'type'    => 'text',
    ]);

    // Дата актуальности
    $wp_customize->add_setting('policy_date', [
        'default'           => '01.01.2026',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('policy_date', [
        'label'   => 'Дата актуальности документа',
        'section' => 'kartemake_policy',
        'type'    => 'text',
    ]);

    // ИНН
    $wp_customize->add_setting('policy_inn', [
        'default'           => '421219133712',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('policy_inn', [
        'label'   => 'ИНН',
        'section' => 'kartemake_policy',
        'type'    => 'text',
    ]);

    // Email для запросов по политике
    $wp_customize->add_setting('policy_email', [
        'default'           => 'privacy@kartemake.ru',
        'sanitize_callback' => 'sanitize_email',
    ]);
    $wp_customize->add_control('policy_email', [
        'label'   => 'Email для запросов по политике',
        'section' => 'kartemake_policy',
        'type'    => 'email',
    ]);
});

// ============================================
// 6. ОБРАБОТЧИК ФОРМЫ
// ============================================

/**
 * Обработка отправки формы
 */
add_action('admin_post_kartemake_submit_form', 'kartemake_handle_form_submission');
add_action('admin_post_nopriv_kartemake_submit_form', 'kartemake_handle_form_submission');

function kartemake_handle_form_submission() {
    // Проверка nonce
    if (!isset($_POST['kartemake_nonce']) || !wp_verify_nonce($_POST['kartemake_nonce'], 'kartemake_form_submit')) {
        wp_die('Ошибка безопасности');
    }

    // Получение данных
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

    // Отправка email
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

// ============================================
// 7. ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/**
 * Добавляем классы для body
 */
add_filter('body_class', function($classes) {
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
});

/**
 * Кастомная длина excerpt для блога
 */
add_filter('excerpt_length', function($length) {
    if (is_home() || is_page('blog') || is_page_template('page-blog.php')) {
        return 25;
    }
    return $length;
}, 999);

/**
 * Кастомное "Читать далее"
 */
add_filter('excerpt_more', function($more) {
    if (is_home() || is_page('blog') || is_page_template('page-blog.php')) {
        return '...';
    }
    return $more;
});

/**
 * Получение ID страницы по пути
 */
function kartmake_get_page_id_by_path($path) {
    $page = get_page_by_path($path);
    if ($page) {
        return $page->ID;
    }
    return 0;
}

/**
 * Получение URL страницы политики
 */
function kartmake_get_policy_url($type = 'privacy-policy') {
    $page_id = kartmake_get_page_id_by_path($type);
    if ($page_id) {
        return get_permalink($page_id);
    }
    return home_url('/' . $type . '/');
}

// ============================================
// 8. КАСТОМНЫЙ ТИП ПОСТОВ "УСЛУГИ"
// ============================================

/**
 * Регистрация кастомного типа постов "Услуги"
 */
add_action('init', 'kartemake_register_services_post_type');

function kartemake_register_services_post_type() {
    register_post_type('services', [
        'labels' => [
            'name'               => 'Услуги',
            'singular_name'      => 'Услуга',
            'add_new'            => 'Добавить услугу',
            'add_new_item'       => 'Добавить новую услугу',
            'edit_item'          => 'Редактировать услугу',
            'new_item'           => 'Новая услуга',
            'view_item'          => 'Просмотр услуги',
            'search_items'       => 'Поиск услуг',
            'not_found'          => 'Услуг не найдено',
            'not_found_in_trash' => 'Услуг в корзине не найдено',
        ],
        'public'        => true,
        'has_archive'   => false,
        'rewrite'       => ['slug' => 'services'],
        'menu_icon'     => 'dashicons-hammer',
        'supports'      => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'],
        'show_in_rest'  => true,
    ]);

    // Регистрация мета-полей для услуг
    register_post_meta('services', 'service_price', [
        'type'          => 'string',
        'single'        => true,
        'show_in_rest'  => true,
    ]);

    register_post_meta('services', 'service_time', [
        'type'          => 'string',
        'single'        => true,
        'show_in_rest'  => true,
    ]);

    register_post_meta('services', 'service_features', [
        'type'          => 'string',
        'single'        => true,
        'show_in_rest'  => true,
    ]);

    register_post_meta('services', 'service_icon', [
        'type'          => 'string',
        'single'        => true,
        'show_in_rest'  => true,
    ]);
}

/**
 * Мета-боксы для услуг
 */
add_action('add_meta_boxes', 'kartemake_services_meta_boxes');

function kartemake_services_meta_boxes() {
    add_meta_box(
        'kartemake_services_meta',
        'Дополнительные параметры услуги',
        'kartemake_services_meta_callback',
        'services',
        'normal',
        'default'
    );
}

function kartemake_services_meta_callback($post) {
    wp_nonce_field('kartemake_services_meta', 'kartemake_services_meta_nonce');

    $price    = get_post_meta($post->ID, 'service_price', true);
    $time     = get_post_meta($post->ID, 'service_time', true);
    $features = get_post_meta($post->ID, 'service_features', true);
    $icon     = get_post_meta($post->ID, 'service_icon', true);
    ?>
    <p>
        <label for="service_price">Стоимость:</label>
        <input type="text" id="service_price" name="service_price" value="<?php echo esc_attr($price); ?>" style="width: 100%;">
        <span class="description">Например: от 200 000 ₽</span>
    </p>
    <p>
        <label for="service_time">Срок/период:</label>
        <input type="text" id="service_time" name="service_time" value="<?php echo esc_attr($time); ?>" style="width: 100%;">
        <span class="description">Например: Проектная работа или от 25 000 ₽/мес</span>
    </p>
    <p>
        <label for="service_features">Особенности (через запятую):</label>
        <input type="text" id="service_features" name="service_features" value="<?php echo esc_attr($features); ?>" style="width: 100%;">
        <span class="description">Например: 1С-Битрикс, WordPress, Интернет-магазины</span>
    </p>
    <p>
        <label for="service_icon">CSS класс иконки:</label>
        <input type="text" id="service_icon" name="service_icon" value="<?php echo esc_attr($icon); ?>" style="width: 100%;">
        <span class="description">Например: icon-server, icon-database, icon-code</span>
    </p>
    <?php
}

/**
 * Сохранение мета-полей услуг
 */
add_action('save_post', 'kartemake_save_services_meta');

function kartemake_save_services_meta($post_id) {
    if (!isset($_POST['kartemake_services_meta_nonce']) ||
        !wp_verify_nonce($_POST['kartemake_services_meta_nonce'], 'kartemake_services_meta')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $fields = ['service_price', 'service_time', 'service_features', 'service_icon'];
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
}

// ============================================
// 9. МЕТА-ПОЛЯ ДЛЯ ЗАПИСЕЙ БЛОГА
// ============================================

/**
 * Мета-боксы для записей блога
 */
add_action('add_meta_boxes', 'kartemake_add_post_meta_boxes');

function kartemake_add_post_meta_boxes() {
    add_meta_box(
        'kartemake_post_meta',
        'Дополнительные настройки поста',
        'kartemake_post_meta_callback',
        'post',
        'side',
        'default'
    );
}

function kartemake_post_meta_callback($post) {
    wp_nonce_field('kartemake_post_meta', 'kartemake_post_meta_nonce');

    $reading_time = get_post_meta($post->ID, 'reading_time', true);
    $views = get_post_meta($post->ID, 'post_views', true);
    ?>
    <p>
        <label for="reading_time">Время чтения (минут):</label>
        <input type="number" id="reading_time" name="reading_time" value="<?php echo esc_attr($reading_time); ?>" style="width: 100%;">
    </p>
    <p>
        <label for="post_views">Количество просмотров:</label>
        <input type="number" id="post_views" name="post_views" value="<?php echo esc_attr($views); ?>" style="width: 100%;">
    </p>
    <?php
}

/**
 * Сохранение мета-полей постов
 */
add_action('save_post', 'kartemake_save_post_meta');

function kartemake_save_post_meta($post_id) {
    if (!isset($_POST['kartemake_post_meta_nonce']) ||
        !wp_verify_nonce($_POST['kartemake_post_meta_nonce'], 'kartemake_post_meta')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['reading_time'])) {
        update_post_meta($post_id, 'reading_time', intval($_POST['reading_time']));
    }

    if (isset($_POST['post_views'])) {
        update_post_meta($post_id, 'post_views', intval($_POST['post_views']));
    }
}

// ============================================
// 10. ПОЛЯ ДЛЯ АВТОРА
// ============================================

/**
 * Добавляем поле "Должность" для автора
 */
add_action('show_user_profile', 'kartemake_extra_user_fields');
add_action('edit_user_profile', 'kartemake_extra_user_fields');

function kartemake_extra_user_fields($user) {
    ?>
    <h3>Дополнительная информация</h3>
    <table class="form-table">
        <tr>
            <th><label for="position">Должность</label></th>
            <td>
                <input type="text" name="position" id="position"
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'position', true)); ?>"
                       class="regular-text" />
                <p class="description">Например: Senior Developer, DevOps Engineer</p>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Сохранение поля "Должность"
 */
add_action('personal_options_update', 'kartemake_save_extra_user_fields');
add_action('edit_user_profile_update', 'kartemake_save_extra_user_fields');

function kartemake_save_extra_user_fields($user_id) {
    if (current_user_can('edit_user', $user_id)) {
        update_user_meta($user_id, 'position', sanitize_text_field($_POST['position']));
    }
}