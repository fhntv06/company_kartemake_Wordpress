<section id="service-wheel" class="scene services-wheel" data-scene="services-wheel">
    <div class="scene-container">
        <header class="scene-header reveal-item">
            <span class="scene-eyebrow">02 / SERVICE SYSTEM</span>
            <h2 class="scene-title">Технические услуги <span>в одной системе.</span></h2>
            <p class="scene-description">Выберите направление или позвольте системе пройти весь цикл. Каждое направление решает свою техническую задачу.</p>
        </header>
        <div class="services-wheel__interface reveal-item">
            <!-- =================================================
                 WHEEL
            ================================================== -->
            <div class="services-wheel__stage">
                <div class="services-wheel__orbit">
                    <span class="services-wheel__orbit-line"></span>
                    <span class="services-wheel__orbit-line services-wheel__orbit-line--secondary"></span>
                </div>
                <!-- =============================================
                     SERVICE ITEMS
                ============================================== -->
                <div class="services-wheel-item is-active" data-service="support" data-index="01" data-position="0" data-href="/services/support/">
                    <button type="button" class="services-wheel-item__trigger" data-service-select="support" aria-label="Выбрать техническую поддержку">
                        <span class="services-wheel-item__index">01</span>
                        <span class="services-wheel-item__name">SUPPORT</span>
                    </button>
                </div>
                <div class="services-wheel-item" data-service="optimization" data-index="02" data-position="1" data-href="/services/optimization/">
                    <button type="button" class="services-wheel-item__trigger" data-service-select="optimization" aria-label="Выбрать оптимизацию">
                        <span class="services-wheel-item__index">02</span>
                        <span class="services-wheel-item__name">OPTIMIZATION</span>
                    </button>
                </div>
                <div class="services-wheel-item" data-service="modernization" data-index="03" data-position="2" data-href="/services/modernization/">
                    <button type="button" class="services-wheel-item__trigger" data-service-select="modernization" aria-label="Выбрать модернизацию">
                        <span class="services-wheel-item__index">03</span>
                        <span class="services-wheel-item__name">MODERNIZATION</span>
                    </button>
                </div>
                <div class="services-wheel-item" data-service="audit" data-index="04" data-position="3" data-href="/services/audit/">
                    <button type="button" class="services-wheel-item__trigger" data-service-select="audit" aria-label="Выбрать аудит и консультации">
                        <span class="services-wheel-item__index">04</span>
                        <span class="services-wheel-item__name">AUDIT</span>
                    </button>
                </div>
                <!-- =============================================
                     CORE
                ============================================== -->
                <div class="services-wheel__core">
                    <span class="services-wheel__core-label">SERVICE CORE</span>
                    <strong class="services-wheel__core-title">K·ART·MAKE</strong>
                    <span class="services-wheel__core-status">
                            <span></span>
                            SYSTEM ACTIVE
                        </span>
                </div>
            </div>
            <!-- =================================================
                 ACTIVE SERVICE
            ================================================== -->
            <div class="services-wheel__details">
                <div class="services-wheel__details-header">
                    <span class="services-wheel__details-label">ACTIVE SERVICE</span>
                    <span class="services-wheel__details-index" data-service-active-index>01 / 04</span>
                </div>
                <div class="services-wheel-detail is-active" data-service-detail="support">
                    <span class="services-wheel-detail__eyebrow">TECHNICAL SUPPORT</span>
                    <h4 class="services-wheel-detail__title">Техническая поддержка</h4>
                    <p class="services-wheel-detail__description">Мы оказываем услуги для бизнеса по четырём направлениям: техническая поддержка, оптимизация, модернизация и аудит цифровых систем.</p>
                    <div class="services-wheel-detail__footer">
                        <div class="services-wheel-detail__price">
                            <span>ОТ</span>
                            <strong>15 000 ₽</strong>
                            <small>/ МЕС.</small>
                        </div>
                        <span class="services-wheel-detail__type">ABONEMENT</span>
                        <a href="<?= get_permalink(get_page_by_path('support')) ?>" class="services-wheel-detail__link">
                            <span>ПОДРОБНЕЕ</span>
                            <strong>↗</strong>
                        </a>
                    </div>
                </div>
                <div class="services-wheel-detail" data-service-detail="optimization">
                    <span class="services-wheel-detail__eyebrow">PERFORMANCE / OPTIMIZATION</span>
                    <h4 class="services-wheel-detail__title">Оптимизация сайта</h4>
                    <p class="services-wheel-detail__description">Находим технические узкие места и устраняем причины проблем с производительностью, скоростью и стабильностью системы.</p>
                    <div class="services-wheel-detail__footer">
                        <div class="services-wheel-detail__price">
                            <span>ОТ</span>
                            <strong>15 000 ₽</strong>
                        </div>
                        <span class="services-wheel-detail__type">PROJECT WORK</span>
                        <a href="<?= get_permalink(get_page_by_path('optimization')) ?>" class="services-wheel-detail__link">
                            <span>ПОДРОБНЕЕ</span>
                            <strong>↗</strong>
                        </a>
                    </div>
                </div>
                <div class="services-wheel-detail" data-service-detail="modernization">
                    <span class="services-wheel-detail__eyebrow">SYSTEM / MODERNIZATION</span>
                    <h4 class="services-wheel-detail__title">Модернизация и развитие систем</h4>
                    <p class="services-wheel-detail__description">Исследуем архитектуру, инфраструктуру, безопасность и производительность, чтобы определить реальные проблемы и приоритетные изменения.</p>
                    <div class="services-wheel-detail__footer">
                        <div class="services-wheel-detail__price">
                            <span>ОТ</span>
                            <strong>15 000 ₽</strong>
                        </div>
                        <span class="services-wheel-detail__type">PROJECT WORK</span>
                        <a href="<?= get_permalink(get_page_by_path('modernization')) ?>" class="services-wheel-detail__link">
                            <span>ПОДРОБНЕЕ</span>
                            <strong>↗</strong>
                        </a>
                    </div>
                </div>
                <div class="services-wheel-detail" data-service-detail="audit">
                    <span class="services-wheel-detail__eyebrow">AUDIT / CONSULTING</span>
                    <h4 class="services-wheel-detail__title">Аудит и консультации</h4>
                    <p class="services-wheel-detail__description">Исследуем архитектуру, инфраструктуру, безопасность и производительность, чтобы определить реальные проблемы и приоритетные изменения.</p>
                    <div class="services-wheel-detail__footer">
                        <div class="services-wheel-detail__price">
                            <span>ОТ</span>
                            <strong>15 000 ₽</strong>
                        </div>
                        <span class="services-wheel-detail__type">AUDIT</span>
                        <a href="<?= get_permalink(get_page_by_path('audit')) ?>" class="services-wheel-detail__link">
                            <span>ПОДРОБНЕЕ</span>
                            <strong>↗</strong>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!-- =====================================================
             WHEEL NAVIGATION
        ====================================================== -->
        <nav class="services-wheel__navigation reveal-item" aria-label="Направления услуг">
            <button type="button" class="services-wheel-nav is-active" data-service-nav="support">
                <span class="services-wheel-nav__index">01</span>
                <span class="services-wheel-nav__label">SUPPORT</span>
            </button>
            <button type="button" class="services-wheel-nav" data-service-nav="optimization">
                <span class="services-wheel-nav__index">02</span>
                <span class="services-wheel-nav__label">OPTIMIZATION</span>
            </button>
            <button type="button" class="services-wheel-nav" data-service-nav="modernization">
                <span class="services-wheel-nav__index">03</span>
                <span class="services-wheel-nav__label">MODERNIZATION</span>
            </button>
            <button type="button" class="services-wheel-nav" data-service-nav="audit">
                <span class="services-wheel-nav__index">04</span>
                <span class="services-wheel-nav__label">AUDIT</span>
            </button>
        </nav>
    </div>
</section>
