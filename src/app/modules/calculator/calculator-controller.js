import GlobalVariables from "../global/variables";

/**
 * ============================================================
 * CALCULATOR
 *
 * HTML = content + configuration
 * JS   = state + calculation + interaction
 * SCSS = presentation
 * ============================================================
 */
export default class CalculatorController {
    constructor() {
        this.scene = document.querySelector('.scene[data-scene="calculator"]');

        if (!this.scene) {
            console.warn("[CalculatorController] Scene not found");
            return;
        }

        this.steps = ['options', 'builder', 'result'];
        this.currentStep = 'options';
        /*
         * --------------------------------------------------------
         * STATE
         * --------------------------------------------------------
         */
        this.state = {
            task: null,
            scale: null,
            additional: [],
            works: [],
        };
        /*
         * --------------------------------------------------------
         * DOM
         * --------------------------------------------------------
         */
        const scene = this.scene

        this.elements = {
            navigation: [
                ...scene.querySelectorAll('[data-calculator-nav]'),
            ],
            stepsNavigation: document.getElementById('calculator-steps'),
            steps: [
                ...scene.querySelectorAll('[data-calculator-step]'),
            ],
            next: [
                ...scene.querySelectorAll('[data-calculator-next]'),
            ],
            back: [
                ...scene.querySelectorAll('[data-calculator-back]'),
            ],
            /*
             * Options
             */
            options: [
                ...scene.querySelectorAll('[data-calculator-option]'),
            ],
            /*
             * Builder
             */
            workSources: [
                ...scene.querySelectorAll('[data-calculator-work-source]'),
            ],
            works: [
                ...scene.querySelectorAll('[data-calculator-work]'),
            ],
            additionalList: scene.querySelector('[data-calculator-additional-list]'),
            /*
             * Summary
             */
            total: scene.querySelector('[data-calculator-total]'),
            count: scene.querySelector('[data-calculator-count]'),
            scale: scene.querySelector('[data-calculator-scale]'),
            /*
             * Result
             */
            resultTotal: scene.querySelector('[data-calculator-result-total]'),
            resultTask: scene.querySelector('[data-calculator-result-task]'),
            resultScale: scene.querySelector('[data-calculator-result-scale]'),
            resultCount: scene.querySelector('[data-calculator-result-count]'),
            resultWorks: scene.querySelector('[data-calculator-result-works]'),
            /*
             * Form
             */
            form: scene.querySelector('[data-calculator-form]'),
        };
        /*
         * --------------------------------------------------------
         * CONFIG
         *
         * Built entirely from HTML.
         * --------------------------------------------------------
         */
        this.config = this.buildConfig();

        this.init()
    }
    /**
     * ============================================================
     * INIT
     * ============================================================
     */
    init() {
        this.bindEvents();
        this.syncStateFromDOM();
        this.updateBuilder();
        this.updateSummary();
        this.showStep(this.currentStep);
    }
    /**
     * ============================================================
     * CONFIG
     *
     * Read configuration from existing HTML.
     * ============================================================
     */
    buildConfig() {
        const config = {
            task: {},
            scale: {},
            additional: {},
            works: {},
        };

        config.headerOffsetHeight = window?.App?.GlobalVariables?.globalConfig.headerOffsetHeight ?? 80
        /*
         * --------------------------------------------------------
         * OPTIONS
         * --------------------------------------------------------
         */
        this.elements.options.forEach((element) => {
            const group = element.dataset.optionGroup;
            const value = element.dataset.value;
            if (!group || !value) {
                return;
            }
            const data = {
                value,
                title: this.readText(element, '.calculator-option__title'),
                description: this.readText(element, '.calculator-option__description'),
                price: this.number(element.dataset.price),
                multiplier: this.number(element.dataset.multiplier),
            };
            if (!config[group]) {
                config[group] = {};
            }
            config[group][value] = data;
        });
        /*
         * --------------------------------------------------------
         * WORKS
         * --------------------------------------------------------
         */
        this.elements.works.forEach((element) => {
            const task = element.dataset.task;
            const id = element.dataset.workId;
            if (!task || !id) {
                return;
            }
            if (!config.works[task]) {
                config.works[task] = [];
            }
            config.works[task].push({
                id,
                task,
                price: this.number(element.dataset.price),
                title: this.readText(element, '.calculator-builder-item__title'),
                description: this.readText(element, '.calculator-builder-item__description'),
                element,
            });
        });
        return config;
    }
    /**
     * ============================================================
     * EVENTS
     * ============================================================
     */
    bindEvents() {
        /*
         * --------------------------------------------------------
         * Navigation
         * --------------------------------------------------------
         */
        this.elements.navigation.forEach((button) => {
            button.addEventListener('click', () => {
                if (button.disabled) {
                    return;
                }
                const step = button.dataset.calculatorNav;
                this.showStep(step);
            });
        });
        /*
         * --------------------------------------------------------
         * Next
         * --------------------------------------------------------
         */
        this.elements.next.forEach((button) => {
            button.addEventListener('click', () => {
                if (!this.validate()) {
                    return;
                }
                const target = button.dataset.calculatorNext;
                if (target === 'builder') {
                    this.prepareBuilder();
                }
                if (target === 'result') {
                    this.prepareResult();
                }
                this.showStep(target);
                this.scrollToCalculatorSteps()
            });
        });
        /*
         * --------------------------------------------------------
         * Back
         * --------------------------------------------------------
         */
        this.elements.back.forEach((button) => {
            button.addEventListener('click', () => {
                const target = button.dataset.calculatorBack;
                this.showStep(target);
            });
        });
        /*
         * --------------------------------------------------------
         * Options
         * --------------------------------------------------------
         */
        this.elements.options.forEach((option) => {
            const input = option.querySelector('input');
            if (!input) {
                return;
            }
            input.addEventListener('change', () => {
                this.syncStateFromDOM();
                this.updateBuilder();
                this.updateSummary();
            });
        });
        /*
         * --------------------------------------------------------
         * Builder works
         * --------------------------------------------------------
         */
        this.elements.works.forEach((work) => {
            const input = work.querySelector('input');
            if (!input) {
                return;
            }
            input.addEventListener('change', () => {
                this.syncWorksFromDOM();
                this.updateSummary();
            });
        });
        /*
         * --------------------------------------------------------
         * Form
         * --------------------------------------------------------
         */
        if (this.elements.form) {
            this.elements.form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.submit();
            });
        }
    }
    scrollToCalculatorSteps() {
        if (!this.elements.stepsNavigation) {
            return;
        }

        const targetPosition =
            this.elements.stepsNavigation.getBoundingClientRect().top +
            window.scrollY -
            this.config.headerOffsetHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
        });
    }
    /**
     * ============================================================
     * STATE
     * ============================================================
     */
    syncStateFromDOM() {
        /*
         * TASK
         */
        const taskInput = this.scene.querySelector('input[name="calculator_task"]:checked');
        this.state.task = taskInput?.value ?? null;
        /*
         * SCALE
         */
        const scaleInput = this.scene.querySelector('input[name="calculator_scale"]:checked');
        this.state.scale = scaleInput?.value ?? null;
        /*
         * ADDITIONAL
         */
        this.state.additional = [
            ...this.scene.querySelectorAll('input[name="calculator_additional"]:checked'),
        ].map((input) => input.value);
        this.syncWorksFromDOM();
    }
    syncWorksFromDOM() {
        this.state.works = this.elements.works.filter((element) => {
            const input = element.querySelector('input');
            return input?.checked;
        }).map((element) => {
            return {
                id: element.dataset.workId,
                task: element.dataset.task,
                price: this.number(element.dataset.price),
                element,
            };
        });
    }
    /**
     * ============================================================
     * STEP NAVIGATION
     * ============================================================
     */
    showStep(step) {
        if (!this.steps.includes(step)) {
            return;
        }
        this.currentStep = step;
        const currentIndex = this.steps.indexOf(step);
        /*
         * Content
         */
        this.elements.steps.forEach((element) => {
            const active = element.dataset.calculatorStep === step;
            element.hidden = !active;
            element.classList.toggle('is-active', active);
        });
        /*
         * Navigation
         */
        this.elements.navigation.forEach((button) => {
            const buttonStep = button.dataset.calculatorNav;
            const index = this.steps.indexOf(buttonStep);
            const active = buttonStep === step;
            const completed = index < currentIndex;
            button.classList.toggle('is-active', active);
            button.classList.toggle('is-completed', completed);
            button.disabled = index > currentIndex;
            if (active) {
                button.setAttribute('aria-current', 'step');
            } else {
                button.removeAttribute('aria-current');
            }
        });
    }
    /**
     * ============================================================
     * BUILDER
     * ============================================================
     */
    prepareBuilder() {
        this.updateBuilder();
        this.updateSummary();
    }
    updateBuilder() {
        /*
         * No task selected.
         */
        if (!this.state.task) {
            this.elements.workSources.forEach((source) => {
                source.hidden = true;
            });
            return;
        }
        /*
         * Show only works belonging
         * to selected task.
         */
        this.elements.workSources.forEach((source) => {
            const sourceTask = source.dataset.calculatorWorkSource;
            const active = sourceTask === this.state.task;
            source.hidden = !active;
        });
        /*
         * Base works for selected task
         * become selected by default.
         */
        this.elements.works.forEach((element) => {
            const task = element.dataset.task;
            if (task !== this.state.task) {
                const input = element.querySelector('input');
                if (input) {
                    input.checked = false;
                }
                return;
            }
            const input = element.querySelector('input');
            if (input) {
                /*
                 * Do not overwrite an existing
                 * user choice when returning.
                 */
                if (typeof input.dataset.initialized === 'undefined') {
                    input.checked = true;
                    input.dataset.initialized = 'true';
                }
            }
        });
        this.syncWorksFromDOM();
        this.renderAdditionalWorks();
    }
    renderAdditionalWorks() {
        if (!this.elements.additionalList) {
            return;
        }
        this.elements.additionalList.innerHTML = '';
        const selectedOptions = this.elements.options.filter((element) => element.dataset.optionGroup === 'additional');
        selectedOptions.forEach((option) => {
            const input = option.querySelector('input');
            if (!input?.checked) {
                return;
            }
            /*
             * Instead of creating new content,
             * clone the existing HTML option.
             */
            const clone = option.cloneNode(true);
            clone.classList.remove('calculator-option');
            clone.classList.add('calculator-builder-item');
            clone.removeAttribute('data-calculator-option');
            clone.setAttribute('data-calculator-work', '');
            clone.dataset.workId = option.dataset.value;
            clone.dataset.task = 'additional';
            clone.querySelector('input').type = 'checkbox';
            clone.querySelector('input').checked = true;
            clone.querySelector('span.calculator-option__title')?.classList.replace('calculator-option__title', 'calculator-builder-item__title');
            clone.querySelector('span.calculator-option__description')?.classList.replace('calculator-option__description', 'calculator-builder-item__description');
            clone.querySelector('span.calculator-option__indicator')?.classList.replace('calculator-option__indicator', 'calculator-builder-item__indicator');
            clone.querySelector('span.calculator-option__price')?.classList.replace('calculator-option__price', 'calculator-builder-item__price');
            const cloneInput = clone.querySelector('input');
            cloneInput.name = 'calculator_builder_additional';
            cloneInput.addEventListener('change', () => {
                const sourceInput = option.querySelector('input');
                sourceInput.checked = cloneInput.checked;
                this.syncStateFromDOM();
                this.updateSummary();
            });
            this.elements.additionalList.appendChild(clone);
        });
    }
    /**
     * ============================================================
     * CALCULATION
     * ============================================================
     */
    calculate() {
        let total = 0;
        /*
         * Base works
         */
        this.state.works.forEach((work) => {
            total += work.price;
        });
        /*
         * Additional works
         */
        this.state.additional.forEach((id) => {
            const option = this.config.additional[id];
            if (!option) {
                return;
            }
            total += option.price;
        });
        /*
         * Scale multiplier
         */
        const scale = this.config.scale[this.state.scale];
        const multiplier = scale?.multiplier || 1;
        total *= multiplier;
        return Math.round(total);
    }
    /**
     * ============================================================
     * SUMMARY
     * ============================================================
     */
    updateSummary() {
        const total = this.calculate();
        const count = this.state.works.length + this.state.additional.length;
        /*
         * Total
         */
        if (this.elements.total) {
            this.elements.total.textContent = this.formatPrice(total);
        }
        /*
         * Count
         */
        if (this.elements.count) {
            this.elements.count.textContent = String(count);
        }
        /*
         * Scale
         */
        if (this.elements.scale) {
            const scale = this.config.scale[this.state.scale];
            this.elements.scale.textContent = scale?.title ?? '—';
        }
    }
    /**
     * ============================================================
     * RESULT
     * ============================================================
     */
    prepareResult() {
        this.updateResult();
        this.renderResultWorks();
    }
    updateResult() {
        const total = this.calculate();
        const count = this.state.works.length + this.state.additional.length;
        /*
         * Total
         */
        if (this.elements.resultTotal) {
            this.elements.resultTotal.textContent = this.formatPrice(total);
        }
        /*
         * Task
         */
        if (this.elements.resultTask) {
            const task = this.config.task[this.state.task];
            this.elements.resultTask.textContent = task?.title ?? '—';
        }
        /*
         * Scale
         */
        if (this.elements.resultScale) {
            const scale = this.config.scale[this.state.scale];
            this.elements.resultScale.textContent = scale?.title ?? '—';
        }
        /*
         * Count
         */
        if (this.elements.resultCount) {
            this.elements.resultCount.textContent = String(count);
        }
    }
    /**
     * ============================================================
     * RESULT WORKS
     * ============================================================
     */
    renderResultWorks() {
        if (!this.elements.resultWorks) {
            return;
        }
        this.elements.resultWorks.innerHTML = '';
        const works = [];
        /*
         * Base works
         */
        this.state.works.forEach((work) => {
            const source = this.elements.works.find((element) => element.dataset.workId === work.id && element.dataset.task === work.task);
            if (!source) {
                return;
            }
            works.push({
                element: source,
                price: work.price,
            });
        });
        /*
         * Additional
         */
        this.state.additional.forEach((id) => {
            const source = this.elements.options.find((element) => element.dataset.optionGroup === 'additional' && element.dataset.value === id);
            if (!source) {
                return;
            }
            works.push({
                element: source,
                price: this.number(source.dataset.price),
            });
        });
        /*
         * Render existing HTML data.
         */
        works.forEach((work, index) => {
            const source = work.element;
            const row = document.createElement('div');
            row.className = 'calculator-result__work';
            const number = document.createElement('span');
            number.className = 'calculator-result__work-number';
            number.textContent = String(index + 1).padStart(2, '0');
            const title = document.createElement('span');
            title.className = 'calculator-result__work-title';
            title.textContent = this.readText(source, '.calculator-builder-item__title') || this.readText(source, '.calculator-option__title');
            const price = document.createElement('span');
            price.className = 'calculator-result__work-price';
            price.textContent = this.formatPrice(work.price);
            row.appendChild(number);
            row.appendChild(title);
            row.appendChild(price);
            this.elements.resultWorks.appendChild(row);
        });
    }
    /**
     * ============================================================
     * VALIDATION
     * ============================================================
     */
    validate() {
        console.log(this.currentStep)
        if (this.currentStep === 'options') {
            if (!this.state.task) {
                this.focus('input[name="calculator_task"]');
                return false;
            }
            if (!this.state.scale) {
                this.focus('input[name="calculator_scale"]');
                return false;
            }
        }
        if (this.currentStep === 'builder') {
            if (!this.state.works.length) {
                return false;
            }
        }
        return true;
    }
    /**
     * ============================================================
     * SUBMIT
     * ============================================================
     */
    submit() {
        const formData = new FormData(this.elements.form);
        const payload = {
            task: this.state.task,
            scale: this.state.scale,
            additional: [...this.state.additional],
            works: this.state.works.map((work) => work.id),
            total: this.calculate(),
            name: formData.get('name'),
            contact: formData.get('contact'),
        };
        /*
         * Пока API не подключаем.
         * Здесь будет реальная отправка конфигурации.
         */
        console.log('Calculator payload:', payload);
    }
    /**
     * ============================================================
     * UTILITIES
     * ============================================================
     */
    readText(element, selector) {
        return element?.querySelector(selector)?.textContent?.trim() ?? '';
    }
    number(value) {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    formatPrice(value) {
        return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
    }
    focus(selector) {
        const element = this.scene.querySelector(selector);
        element?.focus();
    }
}