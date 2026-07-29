export class CookieController {
    constructor(controllerName, container) {
        this.controllerName = controllerName;

        // Элементы баннера
        this.banner = container;
        if (!this.banner) {
            throw new Error(`No have banner in ${controllerName}`)
        }

        this.step1 = container.querySelector('#cookie-step-1');
        this.step2 = container.querySelector('#cookie-step-2');

        // Кнопки шага 1
        this.acceptBtn = container.querySelector('#cookie-accept');
        if (!this.acceptBtn) {
            throw new Error(`No have acceptBtn in ${controllerName}`)
        }

        this.declineBtn = container.querySelector('#cookie-decline');
        if (!this.declineBtn) {
            throw new Error(`No have declineBtn in ${controllerName}`)
        }

        this.settingsOpenBtn = container.querySelector('#cookie-settings-open');
        if (!this.settingsOpenBtn) {
            throw new Error(`No have settingsOpenBtn in ${controllerName}`)
        }

        // Кнопки шага 2
        this.settingsBackBtn = container.querySelector('#cookie-settings-back');
        if (!this.settingsBackBtn) {
            throw new Error(`No have settingsBackBtn in ${controllerName}`)
        }

        this.settingsSaveBtn = container.querySelector('#cookie-settings-save');
        if (!this.settingsSaveBtn) {
            throw new Error(`No have settingsSaveBtn in ${controllerName}`)
        }

        // Переключатели
        this.analyticsCheckbox = container.querySelector('#analytics-cookies');
        if (!this.analyticsCheckbox) {
            throw new Error(`No have analyticsCheckbox in ${controllerName}`)
        }

        this.content = this.banner.querySelector('.cookie-banner__content')
        if (!this.content) {
            throw new Error(`No have content in ${controllerName}`)
        }

        // Состояние
        this.isVisible = false;
        this.isOpen = false;

        this.init();
    }

    init = () => {
        // Проверяем сохранённое согласие
        const savedConsent = localStorage.getItem('cookie_consent');

        this.showBanner();

        if (savedConsent) {
            this.applyConsent(savedConsent);
        }

        // Навешиваем обработчики
        this.bindEvents();
    };

    // ========== ОТОБРАЖЕНИЕ ==========

    showBanner = () => {
        if (this.isVisible) return;
        this.isVisible = true;

        setTimeout(() => {
            requestAnimationFrame(() => {
                this.banner.classList.add('cookie-banner--show');
            });
        }, 500);
    };

    hideBanner = () => {
        if (!this.isVisible) return;
        this.isVisible = false;

        this.banner.classList.remove('cookie-banner--show');
        setTimeout(() => {
            // Возвращаемся на шаг 1
            this.showStep(1);
        }, 400);
    };

    // ========== ШАГИ ==========

    showStep = (stepNumber) => {
        if (stepNumber === 1) {
            this.content.classList.remove('cookie-step--active')
        } else {
            this.content.classList.add('cookie-step--active')
        }
    };

    // ========== СОГЛАСИЕ ==========

    saveConsent = (consent) => {
        const data = {
            analytics: consent.analytics || false,
            date: new Date().toISOString()
        };
        localStorage.setItem('cookie_consent', JSON.stringify(data));
    };

    applyConsent = (consentType) => {
        let analyticsEnabled = false;

        if (consentType === 'all') {
            analyticsEnabled = true;
        } else if (consentType === 'necessary') {
            analyticsEnabled = false;
        } else if (typeof consentType === 'object') {
            analyticsEnabled = consentType.analytics || false;
        }

        if (analyticsEnabled) {
            this.activateAnalytics();
        } else {
            this.deactivateAnalytics();
        }
    };

    // ========== АНАЛИТИКА ==========

    activateAnalytics = () => {
        console.log('✅ Аналитика активирована');
        // Здесь загрузка Яндекс.Метрики
        // this.loadYandexMetrica();
    };

    deactivateAnalytics = () => {
        console.log('❌ Аналитика отключена');
        // Здесь отключение Яндекс.Метрики
    };

    // ========== EVENTS ==========

    bindEvents = () => {
        // Шаг 1
        this.acceptBtn.addEventListener('click', this.handleAccept);
        this.declineBtn.addEventListener('click', this.handleDecline);
        this.settingsOpenBtn.addEventListener('click', this.handleSettingsOpen);

        // Шаг 2
        this.settingsBackBtn.addEventListener('click', this.handleSettingsBack);
        this.settingsSaveBtn.addEventListener('click', this.handleSettingsSave);
    };

    // ========== HANDLERS ==========

    handleAccept = () => {
        const consent = { analytics: true };
        this.saveConsent(consent);
        this.hideBanner();
        this.applyConsent('all');
    };

    handleDecline = () => {
        const consent = { analytics: false };
        this.saveConsent(consent);
        this.hideBanner();
        this.applyConsent('necessary');
    };

    handleSettingsOpen = () => {
        this.showStep(2);
    };

    handleSettingsBack = () => {
        this.showStep(1);
    };

    handleSettingsSave = () => {
        const consent = {
            analytics: this.analyticsCheckbox?.checked
        };
        this.saveConsent(consent);
        this.hideBanner();
        this.applyConsent(consent.analytics ? 'all' : 'necessary');
    };

    // ========== DESTROY ==========

    destroy = () => {
        // Очистка обработчиков, если необходимо
        this.acceptBtn.removeEventListener('click', this.handleAccept);
        this.declineBtn.removeEventListener('click', this.handleDecline);
        this.settingsOpenBtn.removeEventListener('click', this.handleSettingsOpen);
        this.settingsBackBtn.removeEventListener('click', this.handleSettingsBack);
        this.settingsSaveBtn.removeEventListener('click', this.handleSettingsSave);
    };
}
