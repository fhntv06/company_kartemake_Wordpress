<?php
/**
 * Template Name: Главная страница
 * Description: Шаблон для главной страницы сайта
 */

get_header();
?>

    <!-- Секция Hero -->
    <section id="hero" class="hero">
        <div class="container">
            <h1>
                <span>K</span>
                · <span class="color-accent-red">ART</span> ·
                MAKE
            </h1>
            <div class="hero-content">
                <div class="hero-text">
                    <h4>
                        Ваш надежный <span class="color-accent-red">технический партнер</span> для поддержки и развития <span
                            class="color-accent-red">digital-инфраструктуры</span>
                    </h4>
                    <p class="hero-description">
                        <?php echo get_theme_mod('hero_description', 'Мы - это ваш внешний IT-отдел. Мы не агентство. Мы — команда инженеров, которая берет на себя все технические задачи, долги и развитие ваших digital-продуктов, чтобы вы могли сосредоточиться на бизнесе.'); ?>
                    </p>
                    <button
                        class="button button--large button--accent"
                        data-controller-modal-open="form"
                        data-controller-modal-func="open"
                        data-controller-ripple-effect="item"
                    >
                        Обсудить задачу
                    </button>
                </div>
                <div class="hero-devices">
                    <div class="device laptop">
                        <div class="device-screen">Ваш IT-отдел</div>
                    </div>
                    <div class="device tablet">
                        <div class="device-screen">на аутсорсе</div>
                    </div>
                    <div class="device phone">
                        <div class="device-screen">KARTEMAKE</div>
                    </div>
                </div>
            </div>
        </div>

        <div id="scroll-hint" class="scroll-hint color-accent-red font-weight-bold">
            Листайте вниз
            <i class="fas fa-arrow-down"></i>
        </div>
    </section>

    <!-- Секция About -->
    <section id="about" class="about">
        <div class="container">
            <div class="about-top">
                <div class="about-text">
                    <p class="logo">
                        <span class="font-size-h2">K</span>
                        <span class="font-size-h2">·</span>
                        <span class="font-size-h3 color-accent-red">ART</span>
                        <span class="font-size-h2">·</span>
                        <span class="font-size-h4">MAKE</span>
                    </p>
                    <p><?php echo get_theme_mod('about_text_first', 'Мы — распределенная команда fullstack-разработчиков и DevOps-инженеров. Наша философия — прозрачность, гибкость и ориентация на результат, как у внутреннего отдела, но без затрат на штат.'); ?></p>
                    <p><?php echo get_theme_mod('about_text_second', 'Мы становимся вашим техническим департаментом: поддерживаем, развиваем и масштабируем ваши сайты, магазины и веб-приложения, беря на себя все «технические долги».'); ?></p>
                </div>
            </div>

            <div class="divider"></div>

            <div class="stats" data-controller="animation-numbers">
                <div class="stat-item">
                    <div class="stat-number" data-postfix="+" data-controller-animation-numbers="item">
                        <?php echo get_theme_mod('stat_projects', '50'); ?>
                    </div>
                    <div class="stat-label">Поддерживаемых проектов</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" data-postfix="+" data-controller-animation-numbers="item">
                        <?php echo get_theme_mod('stat_uptime', '99.9'); ?>
                    </div>
                    <div class="stat-label">Аптайм, %</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" data-prefix=">" data-controller-animation-numbers="item">
                        <?php echo get_theme_mod('stat_clients', '30'); ?>
                    </div>
                    <div class="stat-label">Клиентов на абонентском обслуживании</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Секция Showreel/Видео -->
    <section id="how-make-it" class="how-make-it">
        <div class="showreel" style="background-image: url('<?php echo get_theme_mod('showreel_image', 'https://skillbox.ru/upload/setka_images/08434114042023_08fda0244b5397e030ee401fd2bea5b24f78a72b.jpg'); ?>');">
            <button
                class="play-button"
                data-controller-modal-open="showreel"
                data-controller-modal-func="open"
                data-controller-ripple-effect="item"
            >
                <i class="fas fa-play"></i>
            </button>
        </div>
    </section>

    <!-- Секция Last Works (Примеры работ) -->
    <section class="last-works">
        <div class="container">
            <h3 class="section__title">Примеры наших работ</h3>
            <div class="works-container">
                <div class="works-list">
                    <?php
                    // Получаем посты для примеров работ
                    $works_args = array(
                        'post_type'      => 'post',
                        'posts_per_page' => 6,
                        'meta_key'       => '_is_work_example',
                        'meta_value'     => '1',
                        'orderby'        => 'date',
                        'order'          => 'DESC'
                    );

                    // Если есть кастомный тип "works"
                    if (post_type_exists('works')) {
                        $works_args['post_type'] = 'works';
                        unset($works_args['meta_key']);
                        unset($works_args['meta_value']);
                    }

                    $works_query = new WP_Query($works_args);

                    if ($works_query->have_posts()) :
                        while ($works_query->have_posts()) : $works_query->the_post();
                            ?>
                            <a href="<?php the_permalink(); ?>" class="work-item">
                                <h3 class="work-title"><?php the_title(); ?></h3>
                                <p class="work-description"><?php echo wp_trim_words(get_the_excerpt(), 20, '...'); ?></p>
                                <a href="<?= get_permalink() ?>" class="work-link">Подробнее <i class="fas fa-arrow-right"></i></a>
                                <!--                                <p class="work-link">Подробнее <i class="fas fa-arrow-right"></i></p>-->
                            </a>
                        <?php
                        endwhile;
                        wp_reset_postdata();
                    else :
                        // Если нет постов, выводим статику
                        ?>
                        <a href="#" class="work-item" >
                            <h3 class="work-title">Миграция и поддержка интернет-магазина на 1С-Битрикс</h3>
                            <p class="work-description">Полный перенос и модернизация крупного магазина с устаревшей CMS. Ежемесячное абонентское обслуживание, включая доработки и интеграции.</p>
<!--                            <p class="work-link">Подробнее <i class="fas fa-arrow-right"></i></p>-->
                        </a>
                        <a href="#" class="work-item" >
                            <h3 class="work-title">Разработка и техподдержка корпоративного портала</h3>
                            <p class="work-description">Создание веб-приложения с внутренней CRM и API. Дальнейшая полная техническая поддержка инфраструктуры и кодовой базы.</p>
<!--                            <p class="work-link">Подробнее <i class="fas fa-arrow-right"></i></p>-->
                        </a>
                        <a href="#" class="work-item" >
                            <h3 class="work-title">Технический аудит и рефакторинг legacy-кода</h3>
                            <p class="work-description">Комплексный аудит безопасности и производительности старого проекта. Оптимизация кода и переход на современный стек для агентства-партнера.</p>
<!--                            <p class="work-link">Подробнее <i class="fas fa-arrow-right"></i></p>-->
                        </a>
                        <a href="#" class="work-item" >
                            <h3 class="work-title">Абонентское обслуживание сети лендингов</h3>
                            <p class="work-description">Постоянная поддержка, обновление контента, исправление ошибок и настройка аналитики для 15+ промо-сайтов производственной компании.</p>
<!--                            <p class="work-link">Подробнее <i class="fas fa-arrow-right"></i></p>-->
                        </a>
                        <a href="#" class="work-item" >
                            <h3 class="work-title">Интеграция платежных систем и CRM в WordPress</h3>
                            <p class="work-description">Глубокая кастомизация и настройка сложных интеграций для сайта сервисной компании. Поддержка 24/7.</p>
<!--                            <p class="work-link">Подробнее <i class="fas fa-arrow-right"></i></p>-->
                        </a>
                        <a href="#" class="work-item" >
                            <h3 class="work-title">Разработка MVP для стартапа</h3>
                            <p class="work-description">Полный цикл: от архитектуры до запуска. После запуска — передача клиента на тариф постоянной технической поддержки.</p>
<!--                            <p class="work-link">Подробнее <i class="fas fa-arrow-right"></i></p>-->
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- Секция Stack Technology -->
    <section class="stack-technology">
        <div class="container">
            <div class="section__title">
                <h3>Наши <span class="color-accent-red">основные</span> технологии</h3>
            </div>
            <div class="stack-categories">
                <div class="scrolling-items">
                    <?php
                    // Массив технологий
                    $technologies = array(
                        array('icon' => 'fab fa-js', 'name' => 'JavaScript'),
                        array('icon' => 'fab fa-react', 'name' => 'React'),
                        array('icon' => 'fab fa-vuejs', 'name' => 'Vue.js'),
                        array('icon' => 'fab fa-node-js', 'name' => 'Node.js'),
                        array('icon' => 'fab fa-python', 'name' => 'Python'),
                        array('icon' => 'fab fa-php', 'name' => 'PHP'),
                        array('icon' => 'fa-bitrix', 'name' => 'Битрикс', 'custom' => '1С'),
                        array('icon' => 'fab fa-wordpress', 'name' => 'WordPress'),
                        array('icon' => 'fab fa-docker', 'name' => 'Docker'),
                        array('icon' => 'fab fa-git-alt', 'name' => 'Git'),
                        array('icon' => 'fas fa-database', 'name' => 'PostgreSQL'),
                        array('icon' => 'fas fa-database', 'name' => 'MySQL'),
                        array('icon' => 'fab fa-aws', 'name' => 'AWS'),
                    );

                    foreach ($technologies as $tech) :
                        ?>
                        <div class="stack-item">
                            <div class="stack-icon">
                                <?php if (isset($tech['custom'])) : ?>
                                    <b class="<?php echo $tech['icon']; ?>"><?php echo $tech['custom']; ?></b>
                                <?php else : ?>
                                    <i class="<?php echo $tech['icon']; ?>"></i>
                                <?php endif; ?>
                            </div>
                            <p class="stack-name font-weight-bold"><?php echo $tech['name']; ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- Секция FAQ -->
    <section class="faq">
        <div class="container">
            <h3 class="section__title">Часто задаваемые вопросы</h3>
            <div class="accordion-container" data-controller="accordion">
                <?php
                // Массив FAQ
                $faq_items = array(
                    array(
                        'question' => 'Вы digital-агентство? Вы делаете дизайн и маркетинг?',
                        'answer' => 'Нет, и в этом наше ключевое отличие. Мы — исключительно техническая команда, ваш аутсорс-отдел разработки и поддержки. Мы не занимаемся дизайном, контентом или привлечением трафика. Мы берем готовый дизайн или существующий продукт и отвечаем за его надежную работу, развитие и все «технические долги».'
                    ),
                    array(
                        'question' => 'Чем вы лучше штатного программиста?',
                        'answer' => 'Вы получаете не одного человека, а сбалансированную команду специалистов (fullstack, backend, DevOps) по цене одного сотрудника. Нет рисков больничных, увольнений и профессионального выгорания. Мы работаем по прозрачным процессам и несем ответственность за результат как партнер.'
                    ),
                    array(
                        'question' => 'Как построена оплата? Есть ли абонентская плата?',
                        'answer' => 'Да, наша основная модель — фиксированная ежемесячная абонентская плата за комплексную поддержку и выделенный пул часов на доработки. Для новых проектов (разработка с нуля, миграция) — проектная оплата по этапам. После запуска проекта клиент обычно переходит на абонентское обслуживание.'
                    ),
                    array(
                        'question' => 'Вы работаете с legacy-кодом и старыми сайтами?',
                        'answer' => 'Это одна из наших специализаций. Мы проводим аудит, рефакторим и поддерживаем проекты на устаревших CMS и технологиях. Мы можем взять на себя поддержку существующего продукта, чтобы ваш бизнес продолжал работать, пока мы плавно модернизируем его архитектуру.'
                    )
                );

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

<?php get_footer(); ?>