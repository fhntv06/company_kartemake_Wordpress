<section class="scene scene-monitoring" data-scene="monitoring">
    <div class="scene-container">
        <div class="monitoring-pin">

            <?php get_template_part('template-parts/components/scene-header', null, array(
                'classes' => 'monitoring-header',
                'eyebrow' => 'ЭТАП 06 / КОНТРОЛЬ',
                'title' => 'После запуска мы не исчезаем',
                'description' => 'Поддерживаем сайт и инфраструктуру в рабочем состоянии: следим за доступностью, производительностью, ошибками и критическими изменениями, чтобы проблемы не становились проблемами вашего бизнеса.'
            )); ?>

            <div class="monitoring-viewport">

                <!-- COMPLETED CARDS STACK -->
                <aside class="monitoring-stack" aria-label="Что находится под контролем">
                    <span class="monitoring-stack-label">ПОД КОНТРОЛЕМ</span>
                    <div class="monitoring-stack-items"></div>
                </aside>

                <!-- MONITORING TRACK -->
                <div class="monitoring-track">

                    <?php
                    $monitoring_cards = array(
                        array(
                            'number' => '01',
                            'label' => 'ДОСТУПНОСТЬ',
                            'title' => 'ДОСТУПНОСТЬ САЙТА',
                            'metric' => '24/7',
                            'description' => 'Контролируем доступность сайта, чтобы ваши клиенты могли пользоваться им в любой момент.',
                            'footer_left' => 'БИЗНЕС',
                            'footer_right' => 'САЙТ ДОСТУПЕН'
                        ),
                        array(
                            'number' => '02',
                            'label' => 'ПРОИЗВОДИТЕЛЬНОСТЬ',
                            'title' => 'СКОРОСТЬ РАБОТЫ',
                            'metric' => 'СТАБИЛЬНО',
                            'description' => 'Следим за скоростью загрузки и откликом системы, чтобы медленный сайт не приводил к потере клиентов.',
                            'footer_left' => 'БИЗНЕС',
                            'footer_right' => 'РАБОТАЕТ БЫСТРО'
                        ),
                        array(
                            'number' => '03',
                            'label' => 'ОШИБКИ',
                            'title' => 'ТЕХНИЧЕСКИЕ ОШИБКИ',
                            'metric' => 'ПОД КОНТРОЛЕМ',
                            'description' => 'Находим технические сбои и неисправности, прежде чем они начинают влиять на работу бизнеса.',
                            'footer_left' => 'СИСТЕМА',
                            'footer_right' => 'СТАБИЛЬНА'
                        ),
                        array(
                            'number' => '04',
                            'label' => 'БЕЗОПАСНОСТЬ',
                            'title' => 'КРИТИЧЕСКИЕ СОБЫТИЯ',
                            'metric' => 'ОТСЛЕЖИВАЕМ',
                            'description' => 'Контролируем состояние системы и обращаем внимание на изменения, которые могут повлиять на её работу.',
                            'footer_left' => 'РИСКИ',
                            'footer_right' => 'ОТСЛЕЖИВАЮТСЯ'
                        ),
                        array(
                            'number' => '05',
                            'label' => 'РЕЗЕРВИРОВАНИЕ',
                            'title' => 'РЕЗЕРВНЫЕ КОПИИ',
                            'metric' => 'ПРОВЕРЯЕМ',
                            'description' => 'Контролируем резервное копирование, чтобы восстановление было возможным тогда, когда оно потребуется.',
                            'footer_left' => 'ДАННЫЕ',
                            'footer_right' => 'ЗАЩИЩЕНЫ'
                        )
                    );

                    foreach ($monitoring_cards as $index => $card) : ?>
                        <article class="monitor-card" data-index="<?php echo $index; ?>">
                            <div class="monitor-card-top">
                                <span><?php echo $card['number']; ?> / <?php echo $card['label']; ?></span>
                                <span class="monitor-card-status">КОНТРОЛЬ</span>
                            </div>
                            <div class="monitor-card-content">
                                <span class="monitor-card-label"><?php echo $card['title']; ?></span>
                                <h4 class="monitor-card-metric"><?php echo $card['metric']; ?></h4>
                                <p><?php echo $card['description']; ?></p>
                            </div>
                            <div class="monitor-card-footer">
                                <span><?php echo $card['footer_left']; ?></span>
                                <span><?php echo $card['footer_right']; ?></span>
                            </div>
                        </article>
                    <?php endforeach; ?>

                </div>

                <!-- FINAL STATE -->
                <div class="monitoring-complete">
                    <span>ЦЕНТР ТЕХНИЧЕСКОГО КОНТРОЛЯ</span>
                    <h3>Вы занимаетесь бизнесом. Мы следим за системой.</h3>
                    <p>Сайт и инфраструктура остаются под техническим контролем после выполнения работ. Если возникает проблема — мы подключаемся и решаем её.</p>
                    <strong>ТЕХНИЧЕСКАЯ ОПОРА БИЗНЕСА</strong>
                </div>

            </div>
        </div>
    </div>
</section>