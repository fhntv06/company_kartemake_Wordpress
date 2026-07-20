<?php
/**
 * Файл функций темы Kartemake
 *
 * @package Kartemake
 */

// ============================================
// 1. НАСТРОЙКИ ТЕМЫ
// ============================================

/**
 * Регистрация меню
 */
register_nav_menus([
    'header-menu' => 'Главное меню в шапке',
    'footer-menu' => 'Меню блок "Полезное"',
    'privacy-menu' => 'Правовая информация блок "Полезное"',
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
    wp_enqueue_style('kartemake-style', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));

    // Font Awesome
    wp_enqueue_style('font-awesome', get_template_directory_uri() . '/assets/css/all.min.css', [], '6.5.1');

    // Основной JS
    // Подключение через CDN
    wp_enqueue_script('gsap', get_template_directory_uri() . '/assets/js/gsap.min.js', [], '3', false);
    wp_enqueue_script('flubber', get_template_directory_uri() . '/assets/js/flubber.min.js', [], '0.4.2', false);
    wp_enqueue_script('flubber', get_template_directory_uri() . '/assets/js/swiper-bundle.min.js', [], '11.2.10', false);

    wp_enqueue_script(
        'kartemake-bundle',                              // ID скрипта
        get_template_directory_uri() . '/assets/js/bundle.js', // Путь к файлу
        [],                                              // Зависимости (если нет - пустой массив)
        wp_get_theme()->get('Version'),                  // Версия
        true                                             // Загружать в футере (true)
    );
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

    // -------- Секция: Подвал --------
    $wp_customize->add_section('kartemake_footer', [
        'title'    => 'Настройки подвала',
        'priority' => 35,
    ]);

    // Текст описания в подвале
    $wp_customize->add_setting('footer_description', [
        'default'           => 'Ваш внешний технический отдел. Поддержка и развитие digital-продуктов',
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
        'default'           => 'KARTEMAKE © 2026. Все права защищены.',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('footer_copyright', [
        'label'   => 'Текст копирайта',
        'section' => 'kartemake_footer',
        'type'    => 'text',
    ]);

    // -------- Секция: Главная - Hero --------
    $wp_customize->add_section('kartemake_hero', [
        'title'    => 'Главная - Hero блок',
        'priority' => 20,
    ]);

    $wp_customize->add_setting('hero_description', [
        'default'           => 'Мы - это ваш внешний IT-отдел. Мы не агентство. Мы — команда инженеров, которая берет на себя все технические задачи, долги и развитие ваших digital-продуктов, чтобы вы могли сосредоточиться на бизнесе.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ]);
    $wp_customize->add_control('hero_description', [
        'label'   => 'Текст описания в Hero блоке',
        'section' => 'kartemake_hero',
        'type'    => 'textarea',
        'rows'    => 5,
    ]);

    // -------- Секция: Главная - О нас --------
    $wp_customize->add_section('kartemake_about', [
        'title'    => 'Главная - О нас',
        'priority' => 21,
    ]);

    $wp_customize->add_setting('about_text_first', [
        'default'           => 'Мы — распределенная команда fullstack-разработчиков и DevOps-инженеров. Наша философия — прозрачность, гибкость и ориентация на результат, как у внутреннего отдела, но без затрат на штат.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ]);
    $wp_customize->add_control('about_text_first', [
        'label'   => 'Первый абзац "О нас"',
        'section' => 'kartemake_about',
        'type'    => 'textarea',
        'rows'    => 3,
    ]);

    $wp_customize->add_setting('about_text_second', [
        'default'           => 'Мы становимся вашим техническим департаментом: поддерживаем, развиваем и масштабируем ваши сайты, магазины и веб-приложения, беря на себя все «технические долги».',
        'sanitize_callback' => 'sanitize_textarea_field',
    ]);
    $wp_customize->add_control('about_text_second', [
        'label'   => 'Второй абзац "О нас"',
        'section' => 'kartemake_about',
        'type'    => 'textarea',
        'rows'    => 3,
    ]);

    // -------- Секция: Главная - Статистика --------
    $wp_customize->add_section('kartemake_stats', [
        'title'    => 'Главная - Статистика',
        'priority' => 22,
    ]);

    $stats = [
        'stat_projects' => ['label' => 'Количество проектов', 'default' => '50'],
        'stat_uptime'   => ['label' => 'Аптайм %', 'default' => '99.9'],
        'stat_clients'  => ['label' => 'Количество клиентов', 'default' => '30'],
    ];

    foreach ($stats as $key => $stat) {
        $wp_customize->add_setting($key, [
            'default'           => $stat['default'],
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        $wp_customize->add_control($key, [
            'label'   => $stat['label'],
            'section' => 'kartemake_stats',
            'type'    => 'text',
        ]);
    }

    // -------- Секция: Главная - Showreel --------
    $wp_customize->add_section('kartemake_showreel', [
        'title'    => 'Главная - Showreel',
        'priority' => 23,
    ]);

    $wp_customize->add_setting('showreel_image', [
        'default'           => 'https://skillbox.ru/upload/setka_images/08434114042023_08fda0244b5397e030ee401fd2bea5b24f78a72b.jpg',
        'sanitize_callback' => 'esc_url_raw',
    ]);
    $wp_customize->add_control('showreel_image', [
        'label'   => 'URL фонового изображения для секции',
        'section' => 'kartemake_showreel',
        'type'    => 'url',
    ]);

    // -------- Секция: Услуги - Статистика --------
    $wp_customize->add_section('kartemake_services_stats', [
        'title'    => 'Услуги - Статистика',
        'priority' => 25,
    ]);

    $services_stats = [
        'services_stat_projects'    => ['label' => 'Количество проектов', 'default' => '12+'],
        'services_stat_specialists' => ['label' => 'Количество специалистов', 'default' => '24+'],
        'services_stat_clients'     => ['label' => 'Довольных клиентов %', 'default' => '98%'],
        'services_stat_years'       => ['label' => 'Лет на рынке', 'default' => '7+'],
    ];

    foreach ($services_stats as $key => $stat) {
        $wp_customize->add_setting($key, [
            'default'           => $stat['default'],
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        $wp_customize->add_control($key, [
            'label'   => $stat['label'],
            'section' => 'kartemake_services_stats',
            'type'    => 'text',
        ]);
    }

    // -------- Секция: Поддержка - Статистика --------
    $wp_customize->add_section('kartemake_support_stats', [
        'title'    => 'Поддержка - Статистика',
        'priority' => 26,
    ]);

    $support_stats = [
        'support_stat_uptime'   => ['label' => 'Uptime %', 'default' => '99'],
        'support_stat_reaction' => ['label' => 'Реакция (часы)', 'default' => '2'],
        'support_stat_team'     => ['label' => 'Команда вместо 1', 'default' => '1'],
    ];

    foreach ($support_stats as $key => $stat) {
        $wp_customize->add_setting($key, [
            'default'           => $stat['default'],
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        $wp_customize->add_control($key, [
            'label'   => $stat['label'],
            'section' => 'kartemake_support_stats',
            'type'    => 'text',
        ]);
    }

    // -------- Секция: Контакты --------
    $wp_customize->add_section('kartemake_contacts_page', [
        'title'    => 'Страница контактов',
        'priority' => 27,
    ]);

    // Телефон
    $wp_customize->add_setting('contact_phone', [
        'default'           => '+7 (908) 946-14-83',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('contact_phone', [
        'label'   => 'Телефон',
        'section' => 'kartemake_contacts_page',
        'type'    => 'text',
    ]);

    // Email для поддержки
    $wp_customize->add_setting('contact_support_email', [
        'default'           => 'support@kartemake.ru',
        'sanitize_callback' => 'sanitize_email',
    ]);
    $wp_customize->add_control('contact_support_email', [
        'label'   => 'Email техподдержки',
        'section' => 'kartemake_contacts_page',
        'type'    => 'email',
    ]);

    // Email для новых проектов
    $wp_customize->add_setting('contact_hello_email', [
        'default'           => 'hello@kartemake.ru',
        'sanitize_callback' => 'sanitize_email',
    ]);
    $wp_customize->add_control('contact_hello_email', [
        'label'   => 'Email для новых проектов',
        'section' => 'kartemake_contacts_page',
        'type'    => 'email',
    ]);

    // Статистика контактов
    $wp_customize->add_setting('contact_stat_projects', [
        'default'           => '99.9',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('contact_stat_projects', [
        'label'   => 'Проектов %',
        'section' => 'kartemake_contacts_page',
        'type'    => 'text',
    ]);

    $wp_customize->add_setting('contact_stat_specialists', [
        'default'           => '2',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('contact_stat_specialists', [
        'label'   => 'Специалистов (часы)',
        'section' => 'kartemake_contacts_page',
        'type'    => 'text',
    ]);

    // -------- Секция: SEO --------
    $wp_customize->add_section('kartemake_seo', [
        'title'    => 'SEO и заголовки',
        'priority' => 40,
    ]);

    // Заголовок для главной
    $wp_customize->add_setting('homepage_title', [
        'default'           => 'KARTEMAKE - Создание и поддержка сайтов',
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    $wp_customize->add_control('homepage_title', [
        'label'   => 'Заголовок главной страницы',
        'section' => 'kartemake_seo',
        'type'    => 'text',
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
    $subject = 'Новая заявка с сайта KARTEMAKE';
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
    if (is_home() || is_page('blog') || is_page_template('page-blog.php')) {
        $classes[] = 'blog-page';
    }
    if (is_single()) {
        $classes[] = 'single-post';
    }
    if (is_page('services') || is_page_template('page-services.php')) {
        $classes[] = 'services-page';
    }
    if (is_page('support') || is_page_template('page-support.php')) {
        $classes[] = 'support-page';
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

// ============================================
// 8. КАСТОМНЫЙ ТИП ПОСТОВ "УСЛУГИ" (опционально)
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

    if (isset($_POST['service_price'])) {
        update_post_meta($post_id, 'service_price', sanitize_text_field($_POST['service_price']));
    }

    if (isset($_POST['service_time'])) {
        update_post_meta($post_id, 'service_time', sanitize_text_field($_POST['service_time']));
    }

    if (isset($_POST['service_features'])) {
        update_post_meta($post_id, 'service_features', sanitize_text_field($_POST['service_features']));
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
