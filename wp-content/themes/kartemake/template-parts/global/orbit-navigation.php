<!-- =================================================
ORBIT NAVIGATION
================================================= -->
<div id="orbit-navigation" class="orbit-navigation">
    <div class="orbit-circle">
        <?php
        $scenes = [];

        if (is_front_page()) {
            $scenes = [
                'hero'       => 'Начало',
                'audit'      => 'Диагностика',
                'solutions'  => 'Решения',
                'architecture' => 'Инфраструктура',
                'pipeline'   => 'Процесс',
                'cost-calculator' => 'Калькулятор стоимости',
                'contact'    => 'Контакты',
            ];
        }

        if (is_page('about')) {
            $scenes = [
                'hero'       => 'Начало',
                'about-intro'      => 'Мы',
                'about-model'  => 'Модель',
                'about-team' => 'Команда',
                'about-philosophy'   => 'Философия',
                'about-contact' => 'Контакты',
            ];
        }

        if (is_page('blog')) {
            $scenes = [
                'hero'       => 'Начало',
                'blog-intro'       => 'Знания',
                'blog-featured'       => 'Избранное',
                'blog-articles'       => 'Архив',
            ];
        }

        if (is_page('calculator')) {
            $scenes = [
                'hero'       => 'Начало',
                'calculator-intro'       => 'Как формируется стоимость',
                'calculator-scene'       => 'Рассчитайте стоимость',
                'calculator-contact'       => 'Готовы обсудить задачу?',
            ];
        }
        if (is_page('contacts')) {
            $scenes = [
                'hero'       => 'Начало',
                'contacts-channels'       => 'Как с нами связаться',
                'contacts-request'       => 'Ситуация, цель, проблема',
                'contacts-process'       => 'Процесс',
                'contacts-cta'       => 'Готовы обсудить задачу?',
            ];
        }
        if (is_page('services')) {
            $scenes = [
                'hero'       => 'Начало',
                'services-wheel'       => 'Технические услуги',
                'services-partnership'       => 'Партнерство',
                'services-cta'       => 'С чего начать?',
            ];
        }
        if (is_page('support')) {
            $scenes = [
                'hero'       => 'Начало',
                'support-systems'       => 'Система поддержки',
                'support-operating'       => 'Процесс поддержки',
                'support-scope'       => 'Технические операции',
                'support-task-types'       => 'Контроль проблемы',
                'support-format'       => 'Стоимость',
                'support-cta'       => 'Контакты',
            ];
        }
        if (is_page('optimization')) {
            $scenes = [
                'hero'       => 'Начало',
                'optimization-signals'       => 'Находим проблему',
                'optimization-map'       => 'Система',
                'optimization-process'       => 'Процесс',
                'optimization-scope'       => 'С чем работаем',
                'optimization-pricing'       => 'Стоимость',
                'optimization-cta'       => 'Контакты',
            ];
        }
        if (is_page('modernization')) {
            $scenes = [
                'hero'       => 'Начало',
                'modernization-signals'       => 'Сигналы к диагностике',
                'modernization-map'       => 'Карта системы',
                'modernization-process'       => 'Процесс',
                'modernization-scope'       => 'Области работы',
                'modernization-pricing'       => 'Стоимость',
                'modernization-results'       => 'Модернизация',
                'modernization-cta'       => 'Контакты',
            ];
        }
        if (is_page('audit')) {
            $scenes = [
                'hero'       => 'Начало',
                'audit-signals'       => 'Проблемы системы',
                'audit-map'       => 'Проверка системы',
                'audit-process'       => 'Процесс',
                'audit-report'       => 'Картина системы',
                'audit-pricing'       => 'Стоимость',
                'audit-cta'       => 'С чего начать?',
            ];
        }
        if (is_page('pricing')) {
            $scenes = [
                    'hero'       => 'Начало',
                    'pricing-intro'       => 'Интро',
                    'pricing-services'       => 'Услуги',
                    'pricing-audit'       => 'Аудит',
                    'pricing-advanced'       => 'Оптимизация и модернизация',
                    'pricing-scope'       => 'Инжиниринг',
                    'pricing-decision'       => 'Контакты',
            ];
        }

        if (!empty($scenes)) {
            $number = 1;
            foreach ($scenes as $id => $label) : ?>
                <button class="orbit-point" data-scene="<?= esc_attr($id); ?>">
                    <span class="orbit-point__description"><?= esc_html($label); ?></span>
                    <span></span>
                    <strong><?= sprintf('%02d', $number); ?></strong>
                </button>
                <?php $number++;
            endforeach;
        }
        ?>
    </div>
</div>
