<?php
/**
 * Секция «Аудит сайта по 152-ФЗ»: cta.
 * @package KARTEMAKE
 */
?>
<section class="scene audit-cta" data-scene="audit-cta">
    <div class="scene-container">
        <header class="scene-header reveal-item">
            <span class="scene-eyebrow">07 / NEXT STEP</span>
            <h2 class="scene-title">Проверим, <span>с чего начать</span></h2>
            <p class="scene-description">Расскажите о вашем сайте — уточним задачу и предложим подходящий объём
                проверки.</p>
        </header>

        <form
              class="form reveal-item"
              data-form
              action="/wp-json/my/v1/lead"
              method="POST"
              enctype="multipart/form-data"
              novalidate
        >
            <header class="form__header">
                <span class="form__label">Заявка / Аудит</span>
                <h3 class="form__title">Отправить данные для аудита</h3>
                <p class="form__description">
                    Укажите контакты и свой сайт, для которого хотите сделать аудит.
                </p>
            </header>

            <div class="form__fields">
                <div class="form__row">
                    <div class="form__field">
                        <label for="form-name">Имя</label>
                        <input type="text" id="form-name" name="name" autocomplete="name"
                               placeholder="Как к вам обращаться?" required>
                        <span class="form__error" data-form-error="name"></span>
                    </div>

                    <div class="form__field">
                        <label for="form-contact">Контакт</label>
                        <input type="text" id="form-contact" name="contact"
                               placeholder="Email или телефон" required>
                        <span class="form__error" data-form-error="contact"></span>
                    </div>
                </div>

                <div class="form__field">
                    <label for="form-message">Сообщение</label>
                    <textarea id="form-message" name="message"
                              placeholder="Кратко опишите задачу или пожелания"></textarea>
                    <span class="form__error" data-form-error="message"></span>
                </div>

                <div class="form__field form__field--files">
                    <label class="form__file-label" for="form-files">
                        Прикрепить файлы
                        <span class="form__file-hint">DOC, DOCX, PDF, RTF · до 5 МБ · максимум 3 файла</span>
                    </label>

                    <label class="form__dropzone" for="form-files" data-form-dropzone>
                        <input
                            type="file"
                            id="form-files"
                            name="files[]"
                            multiple
                            accept=".doc,.docx,.pdf,.rtf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/rtf"
                            data-form-files
                        >
                        <span class="form__dropzone-icon" aria-hidden="true">↑</span>
                        <span class="form__dropzone-text">
                            <strong>Перетащите файлы</strong> или <span class="form__dropzone-link">выберите на устройстве</span>
                          </span>
                    </label>
                    <ul class="form__file-list" data-form-file-list></ul>
                    <span class="form__error" data-form-error="files"></span>
                </div>

                <!-- ЧЕКБОКС СОГЛАСИЯ -->
                <div class="form__field form__field--checkbox">
                    <label class="form__checkbox">
                        <input type="checkbox" name="consent" value="1" required data-form-consent>
                        <span class="form__checkbox-indicator" aria-hidden="true"></span>
                        <span class="form__checkbox-text">
                          Я согласен с
                          <a href="<?= get_permalink(get_page_by_path('privacy-policy')); ?>" target="_blank"
                             rel="noopener noreferrer">политикой конфиденциальности</a>
                          и даю <a href="<?= get_permalink(get_page_by_path('agreement-policy')); ?>" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a>.
                        </span>
                    </label>
                    <span class="form__error" data-form-error="consent"></span>
                </div>

                <input type="hidden" name="form_source" value="audit-compliance-152-fz">

                <!-- honeypot -->
                <input type="text" name="_honey" tabindex="-1" autocomplete="off"
                       style="position:absolute;left:-9999px;opacity:0;">
            </div>

            <div class="form__footer">
                <div class="form__actions">
                    <button type="submit" class="button-primary">Отправить</button>
                    <span class="form__status" data-form-status aria-live="polite"></span>
                </div>
            </div>
        </form>

        <div class="audit-cta__metrics reveal-item">
            <div class="audit-cta__metric"><strong>01</strong><span>REVIEW</span><small>Изучаем сайт</small></div>
            <div class="audit-cta__metric"><strong>02</strong><span>REPORT</span><small>Фиксируем риски</small></div>
            <div class="audit-cta__metric"><strong>03</strong><span>PLAN</span><small>Предлагаем действия</small></div>
        </div>
        <div class="cta-block reveal-item">
            <span class="cta-block__eyebrow">152-ФЗ / K·ART·MAKE</span>
            <h3 class="cta-block__title">Начнём с вашего сайта.</h3>
            <p class="cta-block__text">Напишите адрес сайта и кратко опишите задачу. Мы уточним объём работ и предложим
                следующий шаг.</p>
            <button class="button-primary cta-block__button" data-modal-func="open">
                <span>ОБСУДИТЬ АУДИТ</span>
                <strong>↗</strong>
            </button>
        </div>
        <div class="contact-info">
            <div class="contact-info-item"><span class="contact-info-label">НОВЫЕ ПРОЕКТЫ</span><a
                        href="mailto:hello@kartemake.ru" class="contact-info-value">hello@kartemake.ru</a><span
                        class="contact-info-description">Обсудить аудит и согласовать объём проверки.</span></div>
            <div class="contact-info-item"><span class="contact-info-label">СЛЕДУЮЩИЙ ШАГ</span><span
                        class="contact-info-value">ПЕРВИЧНОЕ ОБСУЖДЕНИЕ</span><span class="contact-info-description">Уточним задачу, состав сайта и сроки.</span>
            </div>
        </div>
    </div>
</section>
