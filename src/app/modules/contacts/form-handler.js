/**
 * FormHandler — универсальный обработчик форм.
 *
 * Поддержка:
 *  - HTML5-валидация + кастомные правила
 *  - чекбокс согласия на обработку ПД (data-form-consent)
 *  - загрузка файлов (dropzone + drag&drop + список с удалением)
 *  - honeypot (_honey)
 *  - JSON или FormData (авто-переключение при наличии файлов)
 *  - колбэки: onBeforeSubmit, onSuccess, onError, onFinally
 *  - статус формы, блокировка кнопки, состояние загрузки
 *
 * Разметка:
 *   <form class="form" data-form data-endpoint="/wp-json/my/v1/lead" novalidate>
 *     <div class="form__field">
 *       <label for="f-name">Имя</label>
 *       <input id="f-name" name="name" required>
 *       <span class="form__error" data-form-error="name"></span>
 *     </div>
 *
 *     <div class="form__field form__field--checkbox">
 *       <label class="form__checkbox">
 *         <input type="checkbox" name="consent" value="1" required data-form-consent>
 *         <span class="form__checkbox-indicator"></span>
 *         <span class="form__checkbox-text">...</span>
 *       </label>
 *       <span class="form__error" data-form-error="consent"></span>
 *     </div>
 *
 *     <div class="form__field form__field--files">
 *       <label class="form__dropzone" for="f-files" data-form-dropzone>
 *         <input type="file" id="f-files" name="files[]" multiple
 *                accept=".doc,.docx,.pdf,.rtf" data-form-files>
 *         ...
 *       </label>
 *       <ul class="form__file-list" data-form-file-list></ul>
 *       <span class="form__error" data-form-error="files"></span>
 *     </div>
 *
 *     <div class="form__footer">
 *       <button type="submit" class="button-primary">Отправить</button>
 *       <span class="form__status" data-form-status aria-live="polite"></span>
 *     </div>
 *   </form>
 *
 * Инициализация:
 *   FormHandler.initAll();
 *   // или
 *   new FormHandler(formEl, { endpoint: '/wp-json/my/v1/lead' });
 */
export default class FormHandler {
    /** @type {WeakMap<HTMLFormElement, FormHandler>} */
    static instances = new WeakMap();

    /* ============================================================
       CONSTRUCTOR
       ============================================================ */
    constructor() {

        this.instances = new Map();

        const forms = document.querySelectorAll('form[data-form]');
        forms.forEach((form) => this._setupForm(form));
    }

    /* ============================================================
       SETUP — настройка одной формы
       ============================================================ */
    _setupForm(form) {
        if (!(form instanceof HTMLFormElement)) return;

        const options = {
            endpoint: form.dataset.endpoint || form.action || '',
            method: (form.dataset.method || 'POST').toUpperCase(),
            bodyMode: form.dataset.bodyMode || 'json',

            rules: {},

            files: {
                maxSize: 3 * 1024 * 1024,
                maxCount: 3,
                accept: ['.doc', '.docx', '.pdf', '.rtf'],
                acceptMime: [
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/pdf',
                    'application/rtf',
                ],
            },

            statusSelector: '[data-form-status]',
            fieldSelector: '.form__field',
            fieldErrorClass: 'form__field--error',
            errorSelector: '[data-form-error]',
            consentSelector: '[data-form-consent]',
            fileInputSelector: '[data-form-files]',
            fileListSelector: '[data-form-file-list]',
            dropzoneSelector: '[data-form-dropzone]',

            onBeforeSubmit: null,
            onSuccess: null,
            onError: null,
            onFinally: null,
        };

        const ctx = {
            form,
            options,
            statusEl:   form.querySelector(options.statusSelector),
            submitBtn:  form.querySelector('[type="submit"]'),
            consentEl:  form.querySelector(options.consentSelector),
            fileInput:  form.querySelector(options.fileInputSelector),
            fileListEl: form.querySelector(options.fileListSelector),
            dropzoneEl: form.querySelector(options.dropzoneSelector),
            files: [],
            isSubmitting: false,
        };

        ctx._onSubmit = this._onSubmit.bind(ctx);
        form.addEventListener('submit', ctx._onSubmit);
        form.setAttribute('novalidate', 'novalidate');

        this._initConsent(ctx);
        this._initFiles(ctx);

        // привязываем методы класса к контексту формы
        ctx.getData        = this.getData.bind(ctx);
        ctx.validate       = this.validate.bind(ctx);
        ctx.resetErrors    = this.resetErrors.bind(ctx);
        ctx.setFieldError  = this.setFieldError.bind(ctx);
        ctx._clearFieldError = this._clearFieldError.bind(ctx);
        ctx.setStatus      = this.setStatus.bind(ctx);
        ctx._nativeMessage = this._nativeMessage.bind(ctx);
        ctx._send          = this._send.bind(ctx);
        ctx._setLoading    = this._setLoading.bind(ctx);
        ctx._addFiles      = this._addFiles.bind(ctx);
        ctx._removeFile    = this._removeFile.bind(ctx);
        ctx._renderFiles   = this._renderFiles.bind(ctx);
        ctx._validateFile  = this._validateFile.bind(ctx);
        ctx._formatSize    = this._formatSize.bind(ctx);
        ctx._initConsent   = this._initConsent.bind(ctx);
        ctx._initFiles     = this._initFiles.bind(ctx);


        form.setAttribute('novalidate', 'novalidate');
        form.addEventListener('submit', ctx._onSubmit);

        ctx._initConsent();
        ctx._initFiles();

        this.instances.set(form, ctx);
    }

    /** Инициализация всех форм на странице */
    static initAll(root = document, options = {}) {
        root.querySelectorAll('form[data-form]').forEach((form) => {
            if (!FormHandler.instances.has(form)) new FormHandler(form, options);
        });
    }

    /** Уничтожение обработчика */
    destroy() {
        this.form.removeEventListener('submit', this._onSubmit);
        FormHandler.instances.delete(this.form);
    }

    /* ============================================================
       CONSENT
       ============================================================ */
    _initConsent() {
        if (!this.consentEl || !this.submitBtn) return;

        const sync = () => {
            this.submitBtn.disabled = this.isSubmitting || !this.consentEl.checked;
        };
        this.consentEl.addEventListener('change', sync);
        sync();
    }

    /* ============================================================
       FILES
       ============================================================ */
    _initFiles() {
        if (!this.fileInput || !this.dropzoneEl) return;

        this.fileInput.addEventListener('change', () => {
            this._addFiles(Array.from(this.fileInput.files || []));
            this.fileInput.value = '';
        });

        ['dragenter', 'dragover'].forEach((ev) =>
            this.dropzoneEl.addEventListener(ev, (e) => {
                e.preventDefault();
                this.dropzoneEl.classList.add('is-dragover');
            })
        );

        ['dragleave', 'drop'].forEach((ev) =>
            this.dropzoneEl.addEventListener(ev, (e) => {
                e.preventDefault();
                this.dropzoneEl.classList.remove('is-dragover');
            })
        );

        this.dropzoneEl.addEventListener('drop', (e) => {
            const dropped = Array.from(e.dataTransfer?.files || []);
            this._addFiles(dropped);
        });
    }

    _validateFile(file) {
        const { maxSize, accept, acceptMime } = this.options.files;
        const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();

        if (!accept.includes(ext) && !acceptMime.includes(file.type)) {
            return `Недопустимый формат: ${ext}`;
        }
        if (file.size > maxSize) {
            return `Файл больше ${Math.round(maxSize / 1024 / 1024)} МБ`;
        }
        return null;
    }

    _addFiles(incoming) {
        const { maxCount } = this.options.files;
        const errors = [];

        for (const file of incoming) {
            if (this.files.length >= maxCount) {
                errors.push(`Максимум ${maxCount} файла`);
                break;
            }
            if (this.files.some((f) => f.name === file.name && f.size === file.size)) {
                errors.push(`«${file.name}» уже добавлен`);
                continue;
            }
            const err = this._validateFile(file);
            if (err) {
                errors.push(`«${file.name}»: ${err}`);
                continue;
            }
            this.files.push(file);
        }

        this._renderFiles();
        if (errors.length) this.setFieldError('files', errors[0]);
        else this._clearFieldError('files');
    }

    _removeFile(index) {
        this.files.splice(index, 1);
        this._renderFiles();
        this._clearFieldError('files');
    }

    _formatSize(bytes) {
        if (bytes < 1024) return bytes + ' Б';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' КБ';
        return (bytes / 1024 / 1024).toFixed(1) + ' МБ';
    }

    _renderFiles() {
        if (!this.fileListEl) return;
        this.fileListEl.innerHTML = '';

        this.files.forEach((file, i) => {
            const li = document.createElement('li');
            li.className = 'form__file-item';

            const name = document.createElement('span');
            name.className = 'form__file-name';
            name.title = file.name;
            name.textContent = file.name;

            const size = document.createElement('span');
            size.className = 'form__file-size';
            size.textContent = this._formatSize(file.size);

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'form__file-remove';
            remove.setAttribute('aria-label', 'Удалить файл');
            remove.textContent = '×';
            remove.addEventListener('click', () => this._removeFile(i));

            li.append(name, size, remove);
            this.fileListEl.appendChild(li);
        });

        if (this.dropzoneEl) {
            const full = this.files.length >= this.options.files.maxCount;
            this.dropzoneEl.classList.toggle('is-disabled', full);
        }
    }

    /* ============================================================
       PUBLIC HELPERS
       ============================================================ */
    getData() {
        const data = {};
        const fd = new FormData(this.form);

        for (const [key, value] of fd.entries()) {
            if (key in data) {
                data[key] = Array.isArray(data[key])
                    ? [...data[key], value]
                    : [data[key], value];
            } else {
                data[key] = value;
            }
        }
        return data;
    }

    resetErrors() {
        this.form.querySelectorAll(`.${this.options.fieldErrorClass}`)
            .forEach((el) => el.classList.remove(this.options.fieldErrorClass));
        this.form.querySelectorAll(this.options.errorSelector)
            .forEach((el) => (el.textContent = ''));
    }

    setFieldError(name, message) {
        const input = this.form.elements[name]
            || this.form.querySelector(`[name="${name}"], [name="${name}[]"]`);
        if (!input) return;

        const field = input.closest(this.options.fieldSelector) || input.parentElement;
        field?.classList.add(this.options.fieldErrorClass);

        const errorEl = field?.querySelector(this.options.errorSelector);
        if (errorEl) errorEl.textContent = message;
    }

    _clearFieldError(name) {
        const input = this.form.elements[name]
            || this.form.querySelector(`[name="${name}"], [name="${name}[]"]`);
        const field = input?.closest(this.options.fieldSelector);
        field?.classList.remove(this.options.fieldErrorClass);
        const err = field?.querySelector(this.options.errorSelector);
        if (err) err.textContent = '';
    }

    setStatus(message, type = '') {
        if (!this.statusEl) return;
        this.statusEl.textContent = message;
        this.statusEl.classList.toggle('form__status--success', type === 'success');
        this.statusEl.classList.toggle('form__status--error', type === 'error');
    }

    /* ============================================================
       VALIDATION
       ============================================================ */
    validate() {
        this.resetErrors();
        const data = this.getData();
        let isValid = true;

        // 1. HTML5
        for (const el of this.form.elements) {
            if (!el.name || el.disabled) continue;
            if (el.type === 'file') continue;

            if (!el.checkValidity()) {
                isValid = false;
                this.setFieldError(el.name, this._nativeMessage(el));
            }
        }

        // 2. Кастомные правила
        for (const [name, rule] of Object.entries(this.options.rules)) {
            const value = data[name];
            const result = rule(value, data, this.form);
            if (result !== true) {
                isValid = false;
                this.setFieldError(name, typeof result === 'string' ? result : 'Некорректное значение');
            }
        }

        // 3. Honeypot
        const honey = this.form.querySelector('[name="_honey"]');
        if (honey && honey.value) isValid = false;

        // 4. Чекбокс согласия
        if (this.consentEl && !this.consentEl.checked) {
            isValid = false;
            this.setFieldError(this.consentEl.name, 'Необходимо согласие на обработку данных');
        }

        // 5. Файлы (обязательность — через data-files-required на форме)
        if (this.form.dataset.filesRequired === 'true' && this.files.length === 0) {
            isValid = false;
            this.setFieldError('files', 'Прикрепите хотя бы один файл');
        }

        return isValid;
    }

    _nativeMessage(el) {
        const v = el.validity;

        if (el.type === 'checkbox' && v.valueMissing) return 'Отметьте согласие';
        if (v.valueMissing) return 'Заполните поле';
        if (v.typeMismatch && el.type === 'email') return 'Некорректный email';
        if (v.typeMismatch && el.type === 'url') return 'Некорректный URL';
        if (v.patternMismatch) return el.dataset.patternMessage || 'Неверный формат';
        if (v.tooShort) return `Минимум ${el.minLength} символов`;
        if (v.tooLong) return `Максимум ${el.maxLength} символов`;
        return 'Проверьте поле';
    }

    /* ============================================================
       SUBMIT
       ============================================================ */
    async _onSubmit(e) {
        e.preventDefault();
        if (this.isSubmitting) return;

        if (!this.validate()) {
            this.setStatus('Проверьте выделенные поля', 'error');
            this.form.querySelector(
                `.${this.options.fieldErrorClass} input, .${this.options.fieldErrorClass} textarea`
            )?.focus();
            return;
        }

        let data = this.getData();

        if (typeof this.options.onBeforeSubmit === 'function') {
            const result = await this.options.onBeforeSubmit(data, this.form);
            if (result === false) return;
            if (result && typeof result === 'object') data = result;
        }

        this._setLoading(true);
        this.setStatus('Отправка…');

        try {
            const response = await this._send(data);

            if (!response.ok) {
                const errBody = await response.json().catch(() => ({}));
                throw new Error(errBody.message || `HTTP ${response.status}`);
            }

            const result = await response.json().catch(() => ({}));

            this.setStatus('Заявка отправлена. Мы свяжемся с вами.', 'success');
            this.form.reset();
            this.files = [];
            this._renderFiles();

            if (typeof this.options.onSuccess === 'function') {
                this.options.onSuccess(result, this.form);
            }
        } catch (err) {
            console.error('[FormHandler]', err);
            this.setStatus(err.message || 'Не удалось отправить. Попробуйте позже.', 'error');

            if (typeof this.options.onError === 'function') {
                this.options.onError(err, this.form);
            }
        } finally {
            this._setLoading(false);
            if (typeof this.options.onFinally === 'function') {
                this.options.onFinally(this.form);
            }
        }
    }

    async _send(data) {
        const { endpoint, method, bodyMode } = this.options;
        if (!endpoint) throw new Error('Не указан endpoint формы');

        const hasFiles = this.files.length > 0;
        const useFormData = hasFiles || bodyMode === 'formdata';

        const headers = { Accept: 'application/json' };
        let body;

        if (useFormData) {
            const fd = new FormData();
            for (const [k, v] of Object.entries(data)) {
                if (Array.isArray(v)) v.forEach((x) => fd.append(k, x));
                else fd.append(k, v);
            }
            this.files.forEach((file) => fd.append('files[]', file, file.name));
            body = fd;
        } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        return fetch(endpoint, {
            method,
            headers,
            body,
            credentials: 'same-origin',
        });
    }

    _setLoading(state) {
        this.isSubmitting = state;
        if (!this.submitBtn) return;

        const consentBlocked = this.consentEl && !this.consentEl.checked;
        this.submitBtn.disabled = state || consentBlocked;

        this.submitBtn.dataset.label ??= this.submitBtn.textContent;
        this.submitBtn.textContent = state ? 'Отправка…' : this.submitBtn.dataset.label;
    }
}