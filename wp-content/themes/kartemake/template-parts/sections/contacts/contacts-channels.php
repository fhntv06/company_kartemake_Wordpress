<section class="scene contacts-channels" data-scene="contacts-channels">
    <div class="scene-container">
        <header class="scene-header reveal-item">
            <span class="scene-eyebrow">02 / КАНАЛЫ СВЯЗИ</span>
            <h2 class="scene-title">Как с нами <span>связаться.</span></h2>
            <p class="scene-description">Выберите удобный канал или сразу опишите задачу. Для новых проектов и технических вопросов используйте соответствующий контакт.</p>
        </header>

        <form
            class="form reveal-item"
            data-form
            data-calculator-form
            action="/wp-json/my/v1/lead"
            method="POST"
            enctype="multipart/form-data"
            novalidate
        >
        <header class="form__header">
          <span class="form__label">Заявка / Конфигурация</span>
          <h3 class="form__title">Отправить конфигурацию</h3>
          <p class="form__description">
            Опишите задачу или прикрепите конфигурацию — мы свяжемся с вами для уточнения деталей.
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
                <a href="<?= get_permalink(get_page_by_path('privacy-policy')); ?>" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a>
                  и даю <a href="<?= get_permalink(get_page_by_path('agreement-policy')); ?>" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a>.
              </span>
            </label>
            <span class="form__error" data-form-error="consent"></span>
          </div>

          <input type="hidden" name="form_source" value="contacts">
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

        <div class="contacts-channels__list reveal-item">
            <div class="contacts-channel">
                <div class="contacts-channel__index">01</div>
                <div class="contacts-channel__content">
                    <span class="contacts-channel__label">НОВЫЕ ПРОЕКТЫ</span>
                    <h5>
                        <a href="mailto:hello@kartemake.ru">hello@kartemake.ru</a>
                    </h5>
                    <p class="contacts-channel__description">Обсудить разработку, модернизацию, оптимизацию или новый технический проект.</p>
                </div>
                <span class="contacts-channel__arrow">↗</span>
            </div>
            <div class="contacts-channel">
                <div class="contacts-channel__index">02</div>
                <div class="contacts-channel__content">
                    <span class="contacts-channel__label">ТЕХНИЧЕСКАЯ ПОДДЕРЖКА</span>
                    <h5>
                        <a href="mailto:support@kartemake.ru">support@kartemake.ru</a>
                    </h5>
                    <p class="contacts-channel__description">Текущие технические задачи, сопровождение и эксплуатация.</p>
                </div>
                <span class="contacts-channel__arrow">↗</span>
            </div>
            <div class="contacts-channel">
                <div class="contacts-channel__index">03</div>
                <div class="contacts-channel__content">
                    <span class="contacts-channel__label">TELEGRAM</span>
                    <h5>
                        <a href="https://t.me/KArtech76" target="_blank" rel="noopener noreferrer">@KArtech76</a>
                    </h5>
                    <p class="contacts-channel__description">Быстрый способ связаться и задать предварительный вопрос.</p>
                </div>
                <span class="contacts-channel__arrow">↗</span>
            </div>
            <div class="contacts-channel">
                <div class="contacts-channel__index">04</div>
                <div class="contacts-channel__content">
                    <span class="contacts-channel__label">ВКОНТАКТЕ</span>
                    <h5>
                        <a href="https://vk.ru/kartemake" target="_blank" rel="noopener noreferrer">vk.ru/kartemake</a>
                    </h5>
                    <p class="contacts-channel__description">Новости и дополнительный канал связи.</p>
                </div>
                <span class="contacts-channel__arrow">↗</span>
            </div>
        </div>
    </div>
</section>
