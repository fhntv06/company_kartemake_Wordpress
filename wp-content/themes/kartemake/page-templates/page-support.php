<?php
/**
 * Template Name: Техподдержка
 * Description: Страница с тарифами и информацией об абонентском обслуживании
 */

get_header();
?>

    <main>
        <section class="hero">
            <div class="container">
                <h1>Абонентское <span class="color-accent-red">обслуживание</span></h1>

                <div class="hero-content">
                    <div class="hero-text">
                        <h4>Команда специалистов в вашем распоряжении</h4>
                        <p>Фиксированная стоимость, доступ к пулу экспертов и полная ответственность за ваш сайт, приложение или сервер. Надёжность, которую вы заслуживаете.</p>
                        <button
                            class="button button--large button--accent"
                            data-controller-modal-open="form"
                            data-controller-modal-func="open"
                        >
                            Получить коммерческое предложение
                        </button>
                    </div>
                    <div class="hero-stats-particle stats-particle" data-controller="animation-numbers">
                        <?php
                        $stats = [
                            ['icon' => 'fa-code', 'number' => get_theme_mod('support_stat_uptime', '99'), 'label' => 'Гарантия uptime', 'postfix' => '%'],
                            ['icon' => 'fa-users', 'number' => get_theme_mod('support_stat_reaction', '2'), 'label' => 'Реакция на срочные задачи', 'prefix' => 'до', 'postfix' => 'ч'],
                            ['icon' => 'fa-rocket', 'number' => get_theme_mod('support_stat_team', '1'), 'label' => 'Команда вместо 1 специалиста'],
                        ];

                        foreach ($stats as $stat) :
                            ?>
                            <div class="stat-item-particle">
                                <span class="particle" style="--tx: -30px; --ty: -40px;"></span>
                                <span class="particle" style="--tx: 30px; --ty: -35px;"></span>
                                <span class="particle" style="--tx: -20px; --ty: 40px;"></span>
                                <span class="stat-icon-particle"><i class="fas <?php echo $stat['icon']; ?>"></i></span>
                                <div class="stat-number-particle font-size-h3 font-weight-bold"
                                    <?php echo isset($stat['prefix']) ? 'data-prefix="' . $stat['prefix'] . '"' : ''; ?>
                                    <?php echo isset($stat['postfix']) ? 'data-postfix="' . $stat['postfix'] . '"' : ''; ?>
                                     data-controller-animation-numbers="item">
                                    <?php echo $stat['number']; ?>
                                </div>
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

        <section class="support">
            <div class="container">
                <h3 class="section__title">Почему именно <span class="color-accent-red">аутсорс?</span></h3>
                <p class="section__description">Ключевое отличие от штатного сотрудника или разового подрядчика — вы получаете не человека, а целый отдел с процессами, экспертизой и ответственностью.</p>

                <div class="stats-particle" data-controller="animation-numbers">
                    <?php foreach ($stats as $stat) : ?>
                        <div class="stat-item-particle">
                            <span class="particle" style="--tx: -30px; --ty: -40px;"></span>
                            <span class="particle" style="--tx: 30px; --ty: -35px;"></span>
                            <span class="particle" style="--tx: -20px; --ty: 40px;"></span>
                            <span class="stat-icon-particle"><i class="fas <?php echo $stat['icon']; ?>"></i></span>
                            <div class="stat-number-particle font-size-h3 font-weight-bold"
                                <?php echo isset($stat['prefix']) ? 'data-prefix="' . $stat['prefix'] . '"' : ''; ?>
                                <?php echo isset($stat['postfix']) ? 'data-postfix="' . $stat['postfix'] . '"' : ''; ?>
                                 data-controller-animation-numbers="item">
                                <?php echo $stat['number']; ?>
                            </div>
                            <div class="stat-label-particle"><?php echo $stat['label']; ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="benefits-grid">
                    <?php
                    $benefits = [
                        [
                            'icon' => 'fa-users',
                            'title' => 'Команда, а не один человек',
                            'description' => 'Доступ к пулу специалистов (разработчики, DevOps, тестировщик). Никаких простоев из-за больничных или отпусков.'
                        ],
                        [
                            'icon' => 'fa-calculator',
                            'title' => 'Фиксированный бюджет',
                            'description' => 'Предсказуемая абонентская плата вместо непредвиденных расходов на срочные задачи, больничные и налоги.'
                        ],
                        [
                            'icon' => 'fa-tasks',
                            'title' => 'Отработанные процессы',
                            'description' => 'У нас есть система постановки задач, приоритизации, контроля качества и отчетности. Вы всегда в курсе статуса.'
                        ],
                        [
                            'icon' => 'fa-briefcase',
                            'title' => 'Фокус на вашем бизнесе',
                            'description' => 'Вам не нужно тратить время на управление IT-специалистом. Вы ставите задачу — мы её выполняем и отчитываемся.'
                        ],
                    ];

                    foreach ($benefits as $benefit) :
                        ?>
                        <div class="benefit-card" data-controller-scroll-reveal="item">
                            <div class="benefit-icon"><i class="fas <?php echo $benefit['icon']; ?>"></i></div>
                            <h3><?php echo $benefit['title']; ?></h3>
                            <p><?php echo $benefit['description']; ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <section class="services-support">
            <div class="container">
                <h3 class="section__title">Тарифы <span class="color-accent-red">поддержки</span></h3>
                <p class="section__description">Гибкие пакеты услуг для бизнесов, которым нужна надежная работа и развитие их digital-инфраструктуры.</p>

                <div class="services-support-tabs" data-controller="tabs">
                    <div class="tabs-nav">
                        <button class="tab-btn active" data-panel="basic" data-controller-tabs-func="open">Начальный</button>
                        <button class="tab-btn" data-panel="pro" data-controller-tabs-func="open">Бизнес</button>
                        <button class="tab-btn" data-panel="enterprise" data-controller-tabs-func="open">Партнерский</button>
                    </div>
                    <div class="tabs-content">
                        <?php
                        $tariffs = [
                            'basic' => [
                                'title' => 'Начальный',
                                'price' => 'от 8 000 ₽/мес',
                                'features' => [
                                    'Мониторинг доступности сайта/сервиса',
                                    'Исправление критических ошибок (до 5 часов/мес)',
                                    'Резервное копирование (еженедельно)',
                                    'Консультации по техническим вопросам',
                                    'Базовое обновление CMS и плагинов',
                                ]
                            ],
                            'pro' => [
                                'title' => 'Бизнес',
                                'price' => 'от 25 000 ₽/мес',
                                'features' => [
                                    'Всё из тарифа "Начальный"',
                                    'Исправление ошибок и доработки (до 15 часов/мес)',
                                    'Приоритетная реакция на запросы (до 2 часов)',
                                    'Резервное копирование (ежедневно)',
                                    'Мониторинг безопасности и производительности',
                                    'Работа с хостингом и инфраструктурой',
                                    'Ежемесячный отчет о проделанной работе',
                                ]
                            ],
                            'enterprise' => [
                                'title' => 'Партнерский',
                                'price' => 'от 70 000 ₽/мес',
                                'features' => [
                                    'Всё из тарифа "Бизнес"',
                                    'Полное абонентское обслуживание (до 40 часов/мес)',
                                    'Круглосуточный мониторинг и реакция 24/7',
                                    'Выделенный менеджер проекта',
                                    'Регулярный аудит безопасности и оптимизации',
                                    'Разработка нового функционала в рамках поддержки',
                                    'Стратегические совещания по развитию продукта',
                                ]
                            ]
                        ];

                        foreach ($tariffs as $key => $tariff) :
                            $active_class = ($key === 'basic') ? 'active' : '';
                            ?>
                            <div class="tab-panel <?php echo $active_class; ?>" id="<?php echo $key; ?>" data-controller-tabs="item">
                                <div class="service-list">
                                    <?php foreach ($tariff['features'] as $feature) : ?>
                                        <div class="service-item"><i class="fas fa-check"></i> <?php echo $feature; ?></div>
                                    <?php endforeach; ?>
                                </div>
                                <div class="service-price">
                                    <h4 class="price"><?php echo $tariff['price']; ?></h4>
                                    <button
                                        class="button button--outline"
                                        data-controller-modal-open="form"
                                        data-controller-modal-func="open"
                                        data-controller-ripple-effect="item"
                                        data-tariff-name="<?php echo $tariff['title']; ?>"
                                        data-tariff-price="<?php echo $tariff['price']; ?>"
                                    >
                                        Выбрать тариф
                                    </button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </section>

        <section class="faq">
            <div class="container">
                <h3 class="section__title">Частые <span class="color-accent-red">вопросы</span></h3>

                <div class="accordion-container" data-controller="accordion">
                    <?php
                    $faq_items = [
                        [
                            'question' => 'Чем вы отличаетесь от штатного программиста?',
                            'answer' => 'Вы получаете не одного человека, а команду специалистов (разработчики, DevOps, тестировщик). У нас есть отработанные процессы, гарантии uptime и фиксированная стоимость. Никаких больничных, отпусков или внезапных увольнений.'
                        ],
                        [
                            'question' => 'Как происходит работа по поддержке?',
                            'answer' => 'Вы ставите задачи в удобный канал (email, чат, тикет-систему). Мы оцениваем и приоритизируем их. Срочные задачи (сайт упал) решаем в течение 2 часов. Остальные — в рамках выделенных часов по тарифу. Ежемесячно предоставляем отчет о проделанной работе.'
                        ],
                        [
                            'question' => 'Что если у нас старый сайт на «кривом» коде?',
                            'answer' => 'Мы специализируемся на работе с legacy-проектами. Сначала проводим аудит, потом предлагаем план: можно постепенно рефакторить в рамках поддержки или выделить отдельный проект на миграцию/переписывание.'
                        ],
                        [
                            'question' => 'Можно ли начать с пробного периода?',
                            'answer' => 'Да, мы предлагаем первый месяц поддержки со скидкой 50%, чтобы вы оценили качество работы и процессы. В течение этого периода вы можете отказаться от услуг без штрафных санкций.'
                        ]
                    ];

                    foreach ($faq_items as $faq) :
                        ?>
                        <div class="accordion-item" data-controller-accordion="item">
                            <div class="accordion-question">
                                <h5><?php echo $faq['question']; ?></h5>
                                <span class="accordion-icon"><i class="fas fa-plus"></i></span>
                            </div>
                            <div class="accordion-answer">
                                <p><?php echo $faq['answer']; ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <section class="cta">
            <div class="container">
                <h3 class="section__title">Освободите себя от технических забот</h3>
                <p>Получите надежного технического партнера, который возьмет на себя все вопросы по вашей digital-инфраструктуре.</p>
                <button
                    class="button button--large button--outline"
                    data-controller-modal-open="form"
                    data-controller-modal-func="open"
                    data-controller-ripple-effect="item"
                >
                    Обсудить поддержку
                </button>
            </div>
        </section>
    </main>

<?php get_footer(); ?>

