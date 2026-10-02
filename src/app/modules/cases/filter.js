/**
 * filter.js — компонент фильтрации и пагинации кейсов
 *
 * Работает автоматически с секцией .cases-archive:
 *   - находит сама себя в DOM
 *   - читает ?tag= и ?page= из URL
 *   - фильтрует по кнопкам .filter__item
 *   - показывает по 4 карточки
 *   - рисует пагинацию в [data-cases-pagination]
 *   - синхронизирует URL через pushState
 *
 * Использование:
 *   new Filter();
 */

export default class Filter {

    constructor() {
        this.root       = document.querySelector('[data-filter-cards]');
        if (!this.root) return;

        this.grid       = this.root.querySelector('[data-filter-grid]');
        this.pagination = this.root.querySelector('[data-filter-pagination]');
        this.filterBtns = Array.from(this.root.querySelectorAll('.filter__item'));

        if (!this.grid) return;

        // Настройки — жёстко внутри
        this.perPage      = 4;
        this.animMs       = 320;
        this.scrollOnPage = true;
        this.urlParam     = 'tag';
        this.pageParam    = 'page';

        // Состояние
        this.state = {
            filter: 'all',
            page: 1,
        };

        // Карточки
        this.allCards = Array.from(this.grid.querySelectorAll('[data-filter-type]'));
        if (!this.allCards.length) return;

        // Доступные фильтры
        this.availableFilters = new Set(
            this.filterBtns.map(b => b.dataset.filter).filter(Boolean)
        );

        this.isAnimating = false;

        this._initFromUrl();
        this._bindEvents();
        this._initCards();
        this.render(false);
    }

    /* =====================================================
       URL
       ===================================================== */

    _initFromUrl() {
        const params = new URLSearchParams(window.location.search);

        const tag  = params.get(this.urlParam);
        const page = parseInt(params.get(this.pageParam), 10);

        this.state.filter = (tag && this.availableFilters.has(tag)) ? tag : 'all';
        this.state.page   = (Number.isFinite(page) && page > 0) ? page : 1;

        this._syncFilterButtons();
    }

    _syncFilterButtons() {
        this.filterBtns.forEach(btn => {
            const active = btn.dataset.filter === this.state.filter;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    _buildUrl() {
        const params = new URLSearchParams(window.location.search);

        if (this.state.filter === 'all') {
            params.delete(this.urlParam);
        } else {
            params.set(this.urlParam, this.state.filter);
        }

        if (this.state.page <= 1) {
            params.delete(this.pageParam);
        } else {
            params.set(this.pageParam, String(this.state.page));
        }

        const qs = params.toString();
        return window.location.pathname + (qs ? `?${qs}` : '');
    }

    _pushUrl() {
        const url = this._buildUrl();
        const current = window.location.pathname + window.location.search;
        if (url !== current) {
            history.pushState(
                { filter: this.state.filter, page: this.state.page },
                '',
                url
            );
        }
    }

    _onPopState() {
        const params = new URLSearchParams(window.location.search);

        const tag  = params.get(this.urlParam);
        const page = parseInt(params.get(this.pageParam), 10);

        const newFilter = (tag && this.availableFilters.has(tag)) ? tag : 'all';
        const newPage   = (Number.isFinite(page) && page > 0) ? page : 1;

        if (newFilter === this.state.filter && newPage === this.state.page) return;

        this.state.filter = newFilter;
        this.state.page   = newPage;

        this._syncFilterButtons();
        this.render(false);
    }

    /* =====================================================
       Инициализация
       ===================================================== */

    _initCards() {
        this.allCards.forEach(card => card.classList.add('is-hidden'));
    }

    _bindEvents() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this._onFilterClick(btn));
        });

        if (this.pagination) {
            this.pagination.addEventListener('click', e => this._onPaginationClick(e));
        }

        window.addEventListener('popstate', () => this._onPopState());
    }

    _onFilterClick(btn) {
        const filter = btn.dataset.filter;
        console.log({filter})
        if (!filter || filter === this.state.filter) return;

        this.state.filter = filter;
        this.state.page   = 1;

        this._syncFilterButtons();
        this._pushUrl();
        this.render(false);
    }

    _onPaginationClick(e) {
        const btn = e.target.closest('.page-numbers');
        if (!btn || btn.disabled) return;

        const page = parseInt(btn.dataset.page, 10);
        if (!page || page === this.state.page) return;

        this.state.page = page;

        this._pushUrl();
        this.render(this.scrollOnPage);
    }

    /* =====================================================
       Геттеры
       ===================================================== */

    _getFilteredCards() {
        if (this.state.filter === 'all') return this.allCards;

        return this.allCards.filter(card => {
            const types = (card.dataset.filterType || '')
                .split(/\s+/)
                .filter(Boolean);
            return types.includes(this.state.filter);
        });
    }

    _getTotalPages(cards) {
        return Math.max(1, Math.ceil(cards.length / this.perPage));
    }

    _getPageCards(cards) {
        const start = (this.state.page - 1) * this.perPage;
        return cards.slice(start, start + this.perPage);
    }

    /* =====================================================
       Анимации
       ===================================================== */

    _hideCard(card) {
        return new Promise(resolve => {
            card.classList.add('is-hiding');
            setTimeout(() => {
                card.classList.add('is-hidden');
                card.classList.remove('is-hiding');
                resolve();
            }, this.animMs);
        });
    }

    _showCard(card) {
        card.classList.remove('is-hidden');
        void card.offsetWidth;
        card.classList.add('is-showing');
        setTimeout(() => {
            card.classList.remove('is-showing');
        }, this.animMs);
    }

    /* =====================================================
       Рендер
       ===================================================== */

    async render(scroll = false) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const filtered   = this._getFilteredCards();
        const totalPages = this._getTotalPages(filtered);

        if (this.state.page > totalPages) this.state.page = totalPages;

        const pageCards = this._getPageCards(filtered);

        // Прячем видимые
        const visible = this.allCards.filter(
            c => !c.classList.contains('is-hidden')
        );
        await Promise.all(visible.map(c => this._hideCard(c)));

        // Показываем нужные
        pageCards.forEach(card => this._showCard(card));

        // Порядок в DOM
        pageCards
            .slice()
            .sort((a, b) => Number(a.dataset.caseIndex) - Number(b.dataset.caseIndex))
            .forEach(card => this.grid.appendChild(card));

        this.renderPagination(totalPages);

        if (scroll) {
            this.root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        this.isAnimating = false;
    }

    /* =====================================================
       Пагинация
       ===================================================== */

    renderPagination(totalPages) {
        if (!this.pagination) return;

        if (totalPages <= 1) {
            this.pagination.innerHTML = '';
            this.pagination.style.display = 'none';
            return;
        }
        this.pagination.style.display = '';

        const items = [];

        // Prev
        if (this.state.page > 1) {
            items.push(`
            <button class="page-numbers prev"
                    type="button"
                    data-page="${this.state.page - 1}"
                    aria-label="Предыдущая страница">
                ←
            </button>
        `);
        }

        // Номера
        for (let p = 1; p <= totalPages; p++) {
            const isCurrent = p === this.state.page;
            items.push(`
            <button class="page-numbers ${isCurrent ? 'current' : ''}"
                    type="button"
                    data-page="${p}"
                    aria-label="Страница ${p}"
                    aria-current="${isCurrent ? 'page' : 'false'}">
                ${String(p).padStart(2, '0')}
            </button>
        `);
        }

        // Next
        if (this.state.page < totalPages) {
            items.push(`
            <button class="page-numbers next"
                    type="button"
                    data-page="${this.state.page + 1}"
                    aria-label="Следующая страница">
                →
            </button>
        `);
        }

        this.pagination.innerHTML = items.join('');
    }
}
