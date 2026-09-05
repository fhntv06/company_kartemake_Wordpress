<section class="scene scene-architecture" data-scene="architecture">
    <div class="scene-container">

        <?php get_template_part('template-parts/components/scene-header', null, array(
            'eyebrow' => 'ЭТАП 04 / ИНФРАСТРУКТУРА',
            'title' => 'Сайт — это только часть<br>вашей цифровой инфраструктуры',
            'description' => 'Разбираемся со всей технической цепочкой: сервером, базами данных, приложением, интеграциями и окружением. Поэтому ищем причину проблемы, а не просто устраняем её внешний симптом.'
        )); ?>

        <div class="architecture-map reveal-item">
            <svg class="architecture-svg">
                <path class="architecture-progress" d="M300 150 C300 250 700 250 700 350 C700 450 300 450 300 550 C300 650 700 650 700 750 C700 850 300 850 300 950"/>
            </svg>

            <!-- SERVER -->
            <article class="architecture-node node-server" data-node="server">
                <div class="node-core">
                    <div class="node-object server-object">
                        <div class="server-slot"></div>
                        <div class="server-slot"></div>
                        <div class="server-slot"></div>
                    </div>
                    <div class="node-particles"></div>
                </div>
                <div class="node-content">
                    <span class="node-label">ИНФРАСТРУКТУРА</span>
                    <h3 class="node-title">Сервер</h3>
                    <p class="node-description">Серверы, Docker, Nginx, окружение и конфигурация системы.</p>
                </div>
            </article>

            <!-- DATABASE -->
            <article class="architecture-node node-database" data-node="database">
                <div class="node-core">
                    <div class="node-object database-object">
                        <div class="database-cylinder">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                    <div class="node-particles"></div>
                </div>
                <div class="node-content">
                    <span class="node-label">ДАННЫЕ</span>
                    <h3 class="node-title">База данных</h3>
                    <p class="node-description">Хранение данных, запросы, производительность и надёжность.</p>
                </div>
            </article>

            <!-- APPLICATION -->
            <article class="architecture-node node-application" data-node="application">
                <div class="node-core">
                    <div class="node-object application-object">
                        <div class="app-layer"></div>
                        <div class="app-layer"></div>
                        <div class="app-layer"></div>
                    </div>
                    <div class="node-particles"></div>
                </div>
                <div class="node-content">
                    <span class="node-label">ПРОДУКТ</span>
                    <h3 class="node-title">Приложение</h3>
                    <p class="node-description">Frontend, Backend, CMS и бизнес-логика, на которых работает ваш продукт.</p>
                </div>
            </article>

            <!-- CLOUD -->
            <article class="architecture-node node-cloud" data-node="cloud">
                <div class="node-core">
                    <div class="node-object cloud-object">
                        <div class="cloud-shape"></div>
                    </div>
                    <div class="node-particles"></div>
                </div>
                <div class="node-content">
                    <span class="node-label">ДОСТУПНОСТЬ</span>
                    <h3 class="node-title">Облачная инфраструктура</h3>
                    <p class="node-description">Развёртывание, масштабирование, доступность и отказоустойчивость.</p>
                </div>
            </article>

            <!-- API -->
            <article class="architecture-node node-api" data-node="api">
                <div class="node-core">
                    <div class="node-object api-object">
                        <span>API</span>
                    </div>
                    <div class="node-particles"></div>
                </div>
                <div class="node-content">
                    <span class="node-label">ИНТЕГРАЦИИ</span>
                    <h3 class="node-title">API и интеграции</h3>
                    <p class="node-description">Обмен данными между сайтом, сервисами, CRM и другими системами.</p>
                </div>
            </article>
        </div>

      <!-- ARCHITECTURE RESULT -->
      <div class="cta-block">
        <span class="cta-block__eyebrow">
          ЧТО ЭТО ДАЁТ БИЗНЕСУ
        </span>
        <p class="cta-block__text">
          Одна техническая команда отвечает за всю цепочку — от сервера до интерфейса пользователя.
        </p>
        <button class="button-primary cta-block__button" data-modal-func="open">
          Обсудить задачу
        </button>
      </div>
    </div>
</section>