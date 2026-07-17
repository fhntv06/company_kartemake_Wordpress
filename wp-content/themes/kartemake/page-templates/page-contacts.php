<?php
/**
 * Template Name: Контакты
 * Description: Страница с контактной информацией
 */

get_header();
?>

    <main>
        <section class="hero">
            <div class="container">
                <h1>Свяжитесь <span class="color-accent-red">с нами</span></h1>

                <div class="hero-content">
                    <div class="hero-text">
                        <h4>Готовы обсудить ваш проект</h4>
                        <p>Расскажите о своей задаче — мы предложим решение и рассчитаем стоимость за 24 часа.</p>
                        <button
                            class="button button--large button--accent"
                            data-controller-modal-open="form"
                            data-controller-modal-func="open"
                        >
                            Описать техническую задачу
                        </button>
                    </div>
                    <div class="hero-stats-particle stats-particle" data-controller="animation-numbers">
                        <?php
                        $stats = [
                            ['icon' => 'fa-code', 'number' => get_theme_mod('contact_stat_projects', '99.9'), 'label' => 'Проектов', 'postfix' => '%'],
                            ['icon' => 'fa-users', 'number' => get_theme_mod('contact_stat_specialists', '2'), 'label' => 'Специалистов', 'postfix' => 'ч'],
                        ];

                        foreach ($stats as $stat) :
                            ?>
                            <div class="stat-item-particle">
                                <span class="particle" style="--tx: -30px; --ty: -40px;"></span>
                                <span class="particle" style="--tx: 30px; --ty: -35px;"></span>
                                <span class="particle" style="--tx: -20px; --ty: 40px;"></span>
                                <span class="stat-icon-particle"><i class="fas <?php echo $stat['icon']; ?>"></i></span>
                                <div class="stat-number-particle font-size-h3 font-weight-bold"
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

        <section>
            <div class="container">
                <h2 class="section__title">Как с нами <span class="color-accent-red">связаться</span></h2>
                <p class="section__description">Мы работаем удаленно по всей России. Выберите удобный способ связи для обсуждения технических вопросов.</p>

                <div class="cards-grid">
                    <div class="vertical-card" data-controller-scroll-reveal="item">
                        <div class="icon">
                            <i class="fas fa-headset font-size-h5"></i>
                        </div>
                        <h4 class="title">Техническая поддержка</h4>
                        <p class="description"><?php echo get_theme_mod('contact_support_email', 'support@kartemake.ru'); ?></p>
                        <p class="description-small">Для срочных запросов и технических проблем</p>
                        <a href="mailto:<?php echo get_theme_mod('contact_support_email', 'support@kartemake.ru'); ?>" class="link">
                            <span>Написать в поддержку</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>

                    <div class="vertical-card" data-controller-scroll-reveal="item">
                        <div class="icon">
                            <i class="fas fa-project-diagram font-size-h5"></i>
                        </div>
                        <h4 class="title">Новые проекты</h4>
                        <p class="description"><?php echo get_theme_mod('contact_hello_email', 'hello@kartemake.ru'); ?></p>
                        <p class="description-small">Для обсуждения разработки, миграции, аудита</p>
                        <a href="mailto:<?php echo get_theme_mod('contact_hello_email', 'hello@kartemake.ru'); ?>" class="link">
                            <span>Обсудить проект</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>

                    <div class="vertical-card" data-controller-scroll-reveal="item">
                        <div class="icon">
                            <i class="fas fa-phone font-size-h5"></i>
                        </div>
                        <h4 class="title">Телефон</h4>
                        <p class="vertical-card__description"><?php echo get_theme_mod('contact_phone', '+7 (908) 946-14-83'); ?></p>
                        <p class="description-small">Пн-Пт, 9:00-18:00 по московскому времени</p>
                        <a href="tel:<?php echo preg_replace('/[^0-9+]/', '', get_theme_mod('contact_phone', '+79089461483')); ?>" class="link">
                            <span>Позвонить</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>

                    <div class="vertical-card" data-controller-scroll-reveal="item">
                        <div class="icon">
                            <i class="fas fa-clock font-size-h5"></i>
                        </div>
                        <h4 class="title">Режим работы</h4>
                        <p class="description">Пн-Пт: 9:00 - 18:00 (МСК)</p>
                        <p class="description-small">Техподдержка: 24/7 для клиентов на абонентском обслуживании</p>
                        <a href="<?php echo get_permalink(get_page_by_path('support')); ?>" class="link">
                            <span>Узнать об SLA</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Секция с картой - закомментирована -->
        <!--
        <section>
            <div class="container">
                <div class="map-container">
                    <div class="map-placeholder">
                        <i class="fas fa-network-wired font-size-h3"></i>
                        <span>Распределенная команда по всей России</span>
                        <div class="map-point" style="top: 30%; left: 40%;">
                            <div class="point-label">Москва<br>Менеджмент</div>
                        </div>
                        <div class="map-point" style="top: 45%; left: 55%;">
                            <div class="point-label">Санкт-Петербург<br>Разработка</div>
                        </div>
                        <div class="map-point" style="top: 60%; left: 65%;">
                            <div class="point-label">Новосибирск<br>DevOps</div>
                        </div>
                        <div class="map-point" style="top: 50%; left: 35%;">
                            <div class="point-label">Екатеринбург<br>Поддержка</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        -->

        <section class="project-form">
            <div class="form-container container">
                <div class="form-header">
                    <h3>Есть техническая задача? <span class="color-accent-red">Опишите её</span></h3>
                    <p>Расскажите о проблеме или задаче — мы проведем бесплатный аудит и предложим решение в течение 24 часов</p>
                </div>
                <form class="contact-form" data-controller="form" method="POST" action="<?php echo admin_url('admin-post.php'); ?>">
                    <?php wp_nonce_field('kartemake_form_submit', 'kartemake_nonce'); ?>
                    <input type="hidden" name="action" value="kartemake_submit_form">

                    <div class="form-group">
                        <input type="text" class="form-input" name="name" id="name-project-form" placeholder=" " required>
                        <label for="name-project-form" class="form-label">Имя</label>
                    </div>

                    <div class="form-group">
                        <input type="text" class="form-input" name="company" id="company-project-form" placeholder=" ">
                        <label for="company-project-form" class="form-label">Название компании</label>
                    </div>

                    <div class="form-group">
                        <input type="email" class="form-input" name="email" id="email-project-form" placeholder=" " required>
                        <label for="email-project-form" class="form-label">Email</label>
                    </div>

                    <div class="form-group">
                        <input type="tel" class="form-input" name="phone" id="phone-project-form" placeholder=" " required>
                        <label for="phone-project-form" class="form-label">Телефон</label>
                    </div>

                    <div class="form-group full-width">
                        <textarea class="form-input" name="message" id="message-project-form" placeholder=" " required rows="4"></textarea>
                        <label for="message-project-form" class="form-label">Опишите вашу техническую задачу или проблему</label>
                    </div>

                    <div class="form-group">
                        <select class="form-input" name="type" id="type-project-form">
                            <option value="">Выберите тип задачи</option>
                            <option value="support">Техническая поддержка сайта</option>
                            <option value="development">Разработка/доработка</option>
                            <option value="migration">Миграция/модернизация</option>
                            <option value="audit">Аудит безопасности/производительности</option>
                            <option value="consulting">Консультация</option>
                            <option value="other">Другое</option>
                        </select>
                        <label for="type-project-form" class="form-label">Тип задачи</label>
                    </div>

                    <div class="form-group">
                        <div class="checkbox-group">
                            <input type="checkbox" id="urgent-project-form" name="urgent" value="1">
                            <label for="urgent-project-form" class="checkbox-label">Срочная задача (ответ в течение 2 часов)</label>
                        </div>
                    </div>

                    <div class="form-button">
                        <button type="submit" class="cta-button" data-controller-ripple-effect="item">
                            Отправить задачу
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>

                    <p class="form-notice">Нажимая на кнопку, вы соглашаетесь с
                        <a href="<?php echo get_privacy_policy_url(); ?>">политикой конфиденциальности</a>. Мы ответим в течение 24 часов.
                    </p>
                </form>
            </div>
        </section>
    </main>

<?php get_footer(); ?>

