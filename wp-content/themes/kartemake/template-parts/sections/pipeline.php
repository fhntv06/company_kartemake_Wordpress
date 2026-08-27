<section class="scene scene-pipeline" data-scene="pipeline">
    <div class="scene-container">

        <?php get_template_part('template-parts/components/scene-header', null, array(
            'classes' => 'pipeline-header',
            'eyebrow' => 'ЭТАП 05 / ПРОЦЕСС РАБОТЫ',
            'title' => 'От первой проблемы до стабильной работы',
            'description' => 'Разбираемся в проблеме, согласовываем результат, выполняем технические работы и проверяем их качество. После запуска остаёмся техническим партнёром вашего бизнеса.'
        )); ?>

        <div class="pipeline-scene">
            <div class="pipeline-track reveal-item">
                <div class="pipeline-line"></div>
                <div class="pipeline-line-progress"></div>

                <?php
                $steps = array(
                    array(
                        'number' => '01',
                        'label' => 'РАЗБИРАЕМСЯ',
                        'title' => 'Находим проблему',
                        'description' => 'Изучаем сайт, инфраструктуру и текущую ситуацию. Определяем, что мешает системе работать нормально.'
                    ),
                    array(
                        'number' => '02',
                        'label' => 'ПЛАНИРУЕМ',
                        'title' => 'Определяем результат',
                        'description' => 'Формируем список задач, сроки и ожидаемый результат. Вы понимаете, что именно будет сделано.'
                    ),
                    array(
                        'number' => '03',
                        'label' => 'РЕШАЕМ',
                        'title' => 'Устраняем проблемы',
                        'description' => 'Вносим изменения в сайт, код, инфраструктуру, интеграции и настройки, необходимые для результата.'
                    ),
                    array(
                        'number' => '04',
                        'label' => 'ПРОВЕРЯЕМ',
                        'title' => 'Тестируем результат',
                        'description' => 'Проверяем выполненные работы и убеждаемся, что система работает так, как договорились.'
                    ),
                    array(
                        'number' => '05',
                        'label' => 'ПОДДЕРЖИВАЕМ',
                        'title' => 'Остаёмся на связи',
                        'description' => 'После запуска продолжаем поддерживать систему, чтобы новые технические проблемы не оставались без решения.'
                    )
                );

                foreach ($steps as $index => $step) : ?>
                    <article class="pipeline-step pipeline-step-<?php echo $index + 1; ?>" data-step="<?php echo $index + 1; ?>">
                        <div class="pipeline-step-marker">
                            <b class="pipeline-step-number"><?php echo $step['number']; ?></b>
                        </div>
                        <div class="pipeline-step-content">
                            <span class="pipeline-step-label"><?php echo $step['label']; ?></span>
                            <h3><?php echo $step['title']; ?></h3>
                            <p><?php echo $step['description']; ?></p>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>