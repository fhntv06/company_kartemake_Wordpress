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
        
        this.tocContainer = this.sidebar.querySelector('[data-toc-links]')
        if (!this.tocContainer) {
            console.warn("[Sidebar] tocContainer element not found")
            return
        }

        this.tocHeadings = Array.from(document.querySelector('main').querySelectorAll('h2'))
        if (!this.tocHeadings.length) {
            console.warn("[Sidebar] tocHeadings elements not found")
            return
        }

        this.tocLinks = []
        this.attrName = 'section'
        this.classActive = 'active'

        this.init()
    }
    init() {
        if (!this.tocToggle || !this.tocContainer) return

        // Состояние: открыто по умолчанию на десктопе, закрыто на мобилке
        if (window.innerWidth <= 1024) this.tocContainer.classList.remove('is-open')
        else this.tocContainer.classList.add('is-open')

        // Обработчик клика
        this.tocToggle.addEventListener('click', (e) => {
            e.preventDefault()
            this.tocContainer.classList.toggle('is-open')
        })

        this.tocHeadings.forEach((heading, index) => {
            heading.id = `${this.attrName}-${index}`

            const link = this.createLinks(heading, index)

            this.tocLinks.push(link)
            this.tocContainer.insertAdjacentElement('beforeend', link)

            this.bindEvents(link)
        })

        // При изменении размера окна — сбрасываем состояние
        let resizeTimeout
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 1024) {
                    this.tocContainer.classList.add('is-open')
                }
            }, 250)
        })
    }
    createLinks = (heading, index) => {
        const link = document.createElement('A')

        link.classList.add('toc-link')

        if (index === 0) link.classList.add('active')

        link.href = `#${this.attrName}-${index}`

        link.textContent = `${heading.textContent}`

        return link
    }
    bindEvents = (link) => {
        link.addEventListener('click', this.activatedLink)
    }
    activatedLink = (event) => {
        this.resetActivatedLink()

        if (event.target) {
            event.target.classList.add(this.classActive)
        } else {
            console.warn('[Sidebar] Link not found!')
        }
    }
    resetActivatedLink = () => {
        this.tocLinks.forEach((link) => {
            link.classList.remove(this.classActive)
        })
    }
}
