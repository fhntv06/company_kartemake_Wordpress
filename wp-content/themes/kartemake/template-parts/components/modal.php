<!-- =================================================
MODAL
================================================= -->
<div id="modal" class="modal">
    <div class="modal-content">
        <!-- Закрытие -->
        <div class="close-modal no-icon" data-modal-func="close"></div>

        <!-- Заголовок -->
        <div class="modal-header">
            <h3>Хотите чтобы мы решили <span class="color-accent">ваш кейс</span>?</h3>
            <p>Оставьте заявку и наш специалист свяжется с вами для обсуждения деталей вашего проекта</p>
        </div>

        <!-- Контейнер с гридом -->
        <div class="form-container">

            <!-- КОЛОНКА 1: КОНТАКТЫ -->
            <div class="contact-modal__body">
                <a href="mailto:hello@kartemake.ru" class="contact-modal__item">
                    <span class="contact-modal__item-label">НОВЫЕ ПРОЕКТЫ</span>
                    <strong class="contact-modal__item-value">hello@kartemake.ru</strong>
                </a>
                <a href="mailto:support@kartemake.ru" class="contact-modal__item">
                    <span class="contact-modal__item-label">ТЕХНИЧЕСКАЯ ПОДДЕРЖКА</span>
                    <strong class="contact-modal__item-value">support@kartemake.ru</strong>
                </a>
            </div>

            <!-- КОЛОНКА 2: СОЦСЕТИ -->
            <div class="contact-modal__body">
                <a href="https://t.me/kartemake" target="_blank" class="contact-modal__item">
                    <span class="contact-modal__item-label">TELEGRAM</span>
                    <strong class="contact-modal__item-value">https://t.me/kartemake</strong>
                </a>
                <a href="https://vk.ru/kartemake" target="_blank" class="contact-modal__item">
                    <span class="contact-modal__item-label">ВКОНТАКТЕ</span>
                    <strong class="contact-modal__item-value">vk.com/kartemake</strong>
                </a>
            </div>

            <!-- КОЛОНКА 3: ИНФОРМАЦИЯ -->
            <div class="contact-modal__body">
                <a href="<?php echo get_permalink(get_page_by_path('privacy-policy')); ?>" class="contact-modal__item">
                    <span class="contact-modal__item-label">ДОКУМЕНТЫ</span>
                    <strong class="contact-modal__item-value">Политика конфиденциальности</strong>
                </a>
            </div>

            <!-- ФУТЕР -->
            <div class="contact-modal__footer">
                <p class="contact-modal__footer-text">Напишите нам — мы ответим в течение 24 часов</p>
            </div>

        </div>
    </div>
</div>