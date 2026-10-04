export default class Sidebar {
    constructor() {
        console.log("[Sidebar] ready")

        this.sidebar = document.getElementById('sidebar')
        if (!this.sidebar) {
            console.warn("[Sidebar] sidebar element not found")
            return
        }

        this.tocToggle = this.sidebar.querySelector('.toc-title')
        if (!this.tocToggle) {
            console.warn("[Sidebar] toc-title element not found")
            return
        }

        this.tocContainer = this.sidebar.querySelector('.toc')
        if (!this.tocContainer) {
            console.warn("[Sidebar] tocContainer element not found")
            return
        }

        this.tocContainerLinks = this.sidebar.querySelector('[data-toc-links]')
        if (!this.tocContainerLinks) {
            console.warn("[Sidebar] tocContainerLinks element not found")
            return
        }

        const main = document.querySelector('main')
        this.tocHeadings = main ? Array.from(main.querySelectorAll('h2')) : []
        if (!this.tocHeadings.length) {
            console.warn("[Sidebar] tocHeadings elements not found")
            return
        }

        this.headerOffsetHeight = window?.App?.GlobalVariables?.getSectionOffset()

        this.tocLinks = []
        this.sections = []              // [{ id, heading, link, offsetTop }]
        this.attrName = 'section'
        this.classActive = 'active'
        this.currentIndex = -1
        this.observer = null
        this.resizeTimeout = null
        this.scrollEndTimer = null

        this.onChangeCurrent = this.onChangeCurrent.bind(this)
        this.handleScrollEnd = this.handleScrollEnd.bind(this)

        this.init()
    }

    init() {
        if (!this.tocToggle || !this.tocContainer) return

        // защита от повторной инициализации
        if (this.tocContainer.dataset.initialized === 'true') return
        this.tocContainer.dataset.initialized = 'true'

        if (window.innerWidth <= 1024) this.tocContainer.classList.remove('is-open')
        else this.tocContainer.classList.add('is-open')

        this.sidebar.addEventListener('change-current', this.onChangeCurrent)

        this.buildLinks()
        this.recalculateOffsets()
        this.bindEvents()

        this.changeCurrent(0)
    }

    buildLinks = () => {
        this.tocContainerLinks.replaceChildren()

        const fragment = document.createDocumentFragment()

        this.sections = this.tocHeadings.map((heading, index) => {
            const id = `${this.attrName}-${index}`
            heading.closest('section').id = id

            const link = document.createElement('A')
            link.classList.add('toc-link')
            link.href = `#${id}`
            link.textContent = heading.textContent
            link.addEventListener('click', (event) => {
                event.preventDefault()
                this.changeCurrent(index)   // скролл делает внешний код
            })

            fragment.appendChild(link)
            this.tocLinks.push(link)

            return {
                id,
                heading,
                link,
                index,
                offsetTop: heading.getBoundingClientRect().top + window.scrollY,
            }
        })

        this.tocContainerLinks.appendChild(fragment)

        // маппинг heading → index для колбэка observer (без find/indexOf)
        this.headingToIndex = new Map()
        this.sections.forEach((s) => this.headingToIndex.set(s.heading, s.index))
    }

    recalculateOffsets = () => {
        this.sections.forEach((s) => {
            s.offsetTop = s.heading.getBoundingClientRect().top + window.scrollY
        })
    }

    bindEvents = () => {
        this.tocToggle.addEventListener('click', (e) => {
            e.preventDefault()
            this.tocContainer.classList.toggle('is-open')
        })

        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout)
            this.resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 1024) {
                    this.tocContainer.classList.add('is-open')
                }
                this.recalculateOffsets()
                this.rebuildObserver()
                this.updateActiveByScroll()
            }, 250)
        })

        // страховка на случай быстрого скролла через несколько секций
        if ('onscrollend' in window) {
            window.addEventListener('scrollend', this.handleScrollEnd, { passive: true })
        } else {
            window.addEventListener('scroll', () => {
                clearTimeout(this.scrollEndTimer)
                this.scrollEndTimer = setTimeout(this.handleScrollEnd, 150)
            }, { passive: true })
        }
    }

    handleScrollEnd = () => {
        this.updateActiveByScroll()
    }

    // --- публичная точка смены активного ---
    changeCurrent = (index) => {
        if (index === this.currentIndex) return
        if (index < 0 || index >= this.sections.length) return

        this.sidebar.dispatchEvent(new CustomEvent('change-current', {
            detail: { index },
            bubbles: false,
        }))
    }

    // --- реакция на change-current: классы + пересоздание observer ---
    onChangeCurrent = (event) => {
        const { index } = event.detail

        const prev = this.currentIndex
        if (prev >= 0) this.tocLinks[prev]?.classList.remove(this.classActive)
        this.tocLinks[index]?.classList.add(this.classActive)
        this.currentIndex = index

        this.rebuildObserver()
    }

    // --- observer ровно на [prev, current, next] ---
    rebuildObserver = () => {
        this.destroyObserver()

        const i = this.currentIndex
        if (i < 0) return

        const header = this.headerOffsetHeight
        const rootMargin =
            `-${header}px 0px -${Math.max(window.innerHeight - header - 1, 0)}px 0px`

        this.observer = new IntersectionObserver(
            () => this.updateActiveByScroll(),
            { rootMargin, threshold: 0 }
        )

        const prev = i - 1
        const next = i + 1

        if (prev >= 0) this.observer.observe(this.sections[prev].heading)
        this.observer.observe(this.sections[i].heading)
        if (next < this.sections.length) this.observer.observe(this.sections[next].heading)
    }

    destroyObserver = () => {
        if (this.observer) {
            this.observer.disconnect()
            this.observer = null
        }
    }

    // --- пересчёт активного по offsetTop; работает в обе стороны ---
    updateActiveByScroll = () => {
        const len = this.sections.length
        if (!len) return

        const scrollPos = window.scrollY + this.headerOffsetHeight
        let i = this.currentIndex < 0 ? 0 : this.currentIndex

        // вниз: следующий уже пройден
        while (i + 1 < len && this.sections[i + 1].offsetTop <= scrollPos) i++
        // вверх: текущий ещё не достигнут
        while (i > 0 && this.sections[i].offsetTop > scrollPos) i--

        if (i !== this.currentIndex) this.changeCurrent(i)
    }
}