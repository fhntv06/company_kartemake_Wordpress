<?php
/**
 * Template Name: Услуги
 * Description: Страница с перечнем услуг
 */

get_header();
?>

    <main>
        <section id="hero" class="hero">
            <div class="container">
                <h1>Технические услуги <span class="color-accent-red">под ключ</span></h1>
                <div class="hero-content">
                    <div class="hero-text">
                        <h4>Всё для вашей веб-инфраструктуры</h4>
                        <p>Разработка, миграция, аудит и абонентское обслуживание — полный цикл технической поддержки.</p>
                        <button
                            class="button button--large button--accent"
                            data-controller-modal-open="form"
                            data-controller-modal-func="open"
                        >
                            Получить консультацию <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>

                    <div class="hero-stats-particle stats-particle">
                        <?php
                        $stats = [
                            ['icon' => 'fa-code', 'number' => get_theme_mod('services_stat_projects', '12+'), 'label' => 'Проектов'],
                            ['icon' => 'fa-users', 'number' => get_theme_mod('services_stat_specialists', '24+'), 'label' => 'Специалистов'],
                            ['icon' => 'fa-rocket', 'number' => get_theme_mod('services_stat_clients', '98%'), 'label' => 'Довольных клиентов'],
                            ['icon' => 'fa-clock', 'number' => get_theme_mod('services_stat_years', '7+'), 'label' => 'Лет на рынке'],
                        ];

                        foreach ($stats as $stat) :
                            ?>
                            <div class="stat-item-particle">
                                <span class="particle" style="--tx: -30px; --ty: -40px;"></span>
                                <span class="particle" style="--tx: 30px; --ty: -35px;"></span>
                                <span class="particle" style="--tx: -20px; --ty: 40px;"></span>
                                <span class="stat-icon-particle"><i class="fas <?php echo $stat['icon']; ?>"></i></span>
                                <div class="stat-number-particle font-size-h3 font-weight-bold"><?php echo $stat['number']; ?></div>
                                <div class="stat-label-particle"><?php echo $stat['label']; ?></div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
            <div id="scroll-hint" class="scroll-hint color-accent-red font-weight-bold">
                Листайте вниз
                <i class="fas fa-arrow-down"></i>
            </div>
        </section>

        <section class="services">
            <div class="container">
                <h2 class="section__title">Комплекс технических <span class="color-accent-red">решений</span></h2>
                <p class="section__description">Полный спектр услуг для поддержки и развития вашей цифровой инфраструктуры. От разовой разработки до ежемесячного абонентского обслуживания.</p>

                <div class="stats-particle">
                    <?php foreach ($stats as $stat) : ?>
                        <div class="stat-item-particle">
                            <span class="particle" style="--tx: -30px; --ty: -40px;"></span>
                            <span class="particle" style="--tx: 30px; --ty: -35px;"></span>
                            <span class="particle" style="--tx: -20px; --ty: 40px;"></span>
                            <span class="stat-icon-particle"><i class="fas <?php echo $stat['icon']; ?>"></i></span>
                            <div class="stat-number-particle font-size-h3 font-weight-bold"><?php echo $stat['number']; ?></div>
                            <div class="stat-label-particle"><?php echo $stat['label']; ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="cards-grid">
                    <?php
                    // Массив услуг (можно вынести в настройки или создать кастомный тип постов)
                    $services = [
                        [
                            'title' => 'Веб-разработка & CMS',
                            'description' => 'Создаем и глубоко кастомизируем корпоративные сайты, интернет-магазины и веб-приложения на 1С-Битрикс и WordPress, включая сложные интеграции.',
                            'features' => ['1С-Битрикс', 'WordPress', 'Интернет-магазины', 'Интеграции (CRM, ERP)'],
                            'price' => 'от 200 000 ₽',
                            'time' => 'Проектная работа',
                        ],
                        [
                            'title' => 'Техническая миграция и модернизация',
                            'description' => 'Переносим сайты с устаревших платформ, оптимизируем legacy-код и обновляем технологии для повышения безопасности, скорости и стабильности.',
                            'features' => ['Перенос сайтов', 'Рефакторинг кода', 'Обновление стеков', 'Оптимизация'],
                            'price' => 'от 120 000 ₽',
                            'time' => 'Срок: от 3 недель',
                        ],
                        [
                            'title' => 'Техподдержка & Инфраструктура',
                            'description' => 'Полное абонентское обслуживание: мониторинг, исправление ошибок, резервное копирование, работа с хостингом и безопасностью. Ваш сайт — под надежным контролем.',
                            'features' => ['Исправление багов', 'Настройка серверов', 'Резервное копирование', 'Доработки'],
                            'price' => 'от 25 000 ₽/мес',
                            'time' => 'Абонентская плата',
                        ],
                        [
                            'title' => 'Аудит и консалтинг',
                            'description' => 'Профессиональная оценка текущего состояния вашего digital-продукта: безопасность, производительность, архитектура. Даем четкий план действий по улучшению.',
                            'features' => ['Аудит безопасности', 'Аудит скорости', 'Технический консалтинг', 'Выбор технологий'],
                            'price' => 'от 10 000 ₽',
                            'time' => 'Разовый аудит',
                        ],
                    ];

                    // Если создан кастомный тип постов "services" - выводим их
                    if (post_type_exists('services')) {
                        $services_query = new WP_Query([
                            'post_type' => 'services',
                            'posts_per_page' => -1,
                            'orderby' => 'menu_order',
                            'order' => 'ASC',
                        ]);

                        if ($services_query->have_posts()) {
                            $services = [];
                            while ($services_query->have_posts()) {
                                $services_query->the_post();
                                $services[] = [
                                    'title' => get_the_title(),
                                    'description' => get_the_excerpt(),
                                    'features' => explode(',', get_post_meta(get_the_ID(), 'service_features', true)),
                                    'price' => get_post_meta(get_the_ID(), 'service_price', true),
                                    'time' => get_post_meta(get_the_ID(), 'service_time', true),
                                ];
                            }
                            wp_reset_postdata();
                        }
                    }

                    foreach ($services as $service) :
                        ?>
                        <div class="service-card">
                            <div class="service-content">
                                <h3 class="service-title"><?php echo $service['title']; ?></h3>
                                <p class="service-description"><?php echo $service['description']; ?></p>
                                <div class="service-features">
                                    <?php foreach ($service['features'] as $feature) : ?>
                                        <span class="service-feature"><?php echo trim($feature); ?></span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                            <div class="service-details">
                                <div class="service-price"><?php echo $service['price']; ?></div>
                                <div class="service-time"><?php echo $service['time']; ?></div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
    </main>

<?php get_footer(); ?>