/**
 * ============================================================
 * FormHandler — универсальный обработчик форм.
 *
 * Конструктор без аргументов: сам находит все <form data-form>
 * и включает логику. Один виджет SmartCaptcha используется
 * для всех форм на странице.
 *
 *   import { FormHandler } from './form-handler.js';
 *   new FormHandler();
 *
 * Разметка:
 *   <form class="form" data-form action="/wp-json/my/v1/lead" novalidate>
 *     <input type="hidden" name="form_source" value="calculator">
 *     ...
 *   </form>
 *
 *   <!-- один раз на странице, вне формы -->
 *   <div id="smartcaptcha-container"
 *        data-sitekey="ysc1_ТВОЙ_КЛИЕНТСКИЙ_КЛЮЧ"
 *        data-robustness="medium"></div>
 *
 *   <script src="https://smartcaptcha.cloud.yandex.ru/captcha.js" defer></script>
 * ============================================================
 */
export default class FormHandler {
    constructor() {
        this.instances = new Map();
        this.captchaWidgetId = null;
        this.captchaToken = null;
        this.captchaReady = false;

        // 1. Находим все формы
        document.querySelectorAll('form[data-form]').forEach((form) => {
            this._setup(form);
        });

        // 2. Инициализируем SmartCaptcha (один раз на страницу)
        this._initSmartCaptcha();
    }

    /* ============================================================
       SMART CAPTCHA
       ============================================================ */

    _initSmartCaptcha() {
        const container = document.getElementById('smartcaptcha-container');
        if (!container) return;

        const clientKey = container.dataset.sitekey;
        if (!clientKey) {
            console.warn('[FormHandler] SmartCaptcha: нет data-sitekey');
            return;
        }

        const tryInit = () => {
            if (typeof window.smartCaptcha === 'undefined') return false;

            if (this.captchaWidgetId !== null) return true; // уже инициализирован

            try {
                this.captchaWidgetId = window.smartCaptcha.render(container, {
                    sitekey: clientKey,
                    invisible: true,
                    shield: container.dataset.robustness || 'medium',
                    callback: (token) => {
                        this.captchaToken = token;
                    },
                    'error-callback': (err) => {
                        console.error('[FormHandler] SmartCaptcha error:', err);
                        this.captchaToken = null;
                    },
                });
                this.captchaReady = true;
                return true;
            } catch (err) {
                console.error('[FormHandler] SmartCaptcha render failed:', err);
                return false;
            }
        };

        // Если скрипт уже загружен — инициализируем сразу
        if (tryInit()) return;

        // Иначе ждём загрузки скрипта (defer)
        const waitForCaptcha = setInterval(() => {
            if (tryInit()) clearInterval(waitForCaptcha);
        }, 200);

        // Защита от бесконечного ожидания
        setTimeout(() => clearInterval(waitForCaptcha), 10000);
    }

    /**
     * Получить свежий токен SmartCaptcha.
     * Токен живёт 2 минуты, поэтому получаем прямо перед отправкой.
     */
    async _getCaptchaToken() {
        if (!this.captchaReady || this.captchaWidgetId === null) {
            return null;
        }

        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve(null);
            }, 10000);

            this.captchaToken = null;
            window.smartCaptcha.execute(this.captchaWidgetId);

            const check = setInterval(() => {
                if (this.captchaToken) {
                    clearInterval(check);
                    clearTimeout(timeout);
                    resolve(this.captchaToken);
                }
            }, 100);
        });
    }

    /* ============================================================
       SETUP
       ============================================================ */

    _setup(form) {
        if (!(form instanceof HTMLFormElement)) return;
        if (this.instances.has(form)) return;

        const options = {
            endpoint: form.action || form.dataset.endpoint || '',
            method: (form.method || 'POST').toUpperCase(),
            bodyMode: form.dataset.bodyMode || 'formdata',

            rules: {},

            files: {
                maxSize: 5 * 1024 * 1024,
                maxCount: 3,
                accept: ['.doc', '.docx', '.pdf', '.rtf'],
                acceptMime: [
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/pdf',
                    'application/rtf',
                ],
            },

            statusSelector:    '[data-form-status]',
            fieldSelector:     '.form__field, .calculator-result__field',
            fieldErrorClass:   'form__field--error',
            errorSelector:     '[data-form-error]',
            consentSelector:   '[data-form-consent]',
            fileInputSelector: '[data-form-files]',
            fileListSelector:  '[data-form-file-list]',
            dropzoneSelector:  '[data-form-dropzone]',

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
            handler: this,
        };

        // Привязываем методы к контексту формы
        const methods = [
            '_onSubmit',
            '_initConsent',
            '_initFiles',
            '_addFiles',
            '_removeFile',
            '_renderFiles',
            '_validateFile',
            '_formatSize',
            'getData',
            'validate',
            'resetErrors',
            'setFieldError',
            '_clearFieldError',
            'setStatus',
            '_nativeMessage',
            '_send',
            '_setLoading',
        ];
        methods.forEach((m) => (ctx[m] = this[m].bind(ctx)));

        // Включаем
        form.setAttribute('novalidate', 'novalidate');
        form.addEventListener('submit', ctx._onSubmit);

        ctx._initConsent();
        ctx._initFiles();

        this.instances.set(form, ctx);
    }

    /* ============================================================
       PUBLIC API
       ============================================================ */

    get(form) {
        return this.instances.get(form) || null;
    }

    destroy(form) {
        const ctx = this.instances.get(form);
        if (!ctx) return;
        form.removeEventListener('submit', ctx._onSubmit);
        this.instances.delete(form);
    }

    destroyAll() {
        for (const form of [...this.instances.keys()]) this.destroy(form);
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
       HELPERS
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
            this.form
                .querySelector(`.${this.options.fieldErrorClass} input, .${this.options.fieldErrorClass} textarea`)
                ?.focus();
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
            // SmartCaptcha — получаем свежий токен прямо перед отправкой
            const token = await this.handler._getCaptchaToken();
            if (token) {
                data['smart-token'] = token;
            } else if (this.handler.captchaReady) {
                console.warn('[FormHandler] SmartCaptcha: токен не получен, отправляем без него');
            }

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
                else if (v && typeof v === 'object') fd.append(k, JSON.stringify(v));
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