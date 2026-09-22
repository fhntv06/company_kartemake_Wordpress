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

        this.tocLinks = Array.from(this.tocContainer.querySelectorAll('.toc-link'))
        if (!this.tocLinks.length) {
            console.warn("[Sidebar] tocLinks elements not found")
            return
        }

        this.tocHeadings = Array.from(document.querySelector('main').querySelectorAll('h2'))
        if (!this.tocHeadings.length) {
            console.warn("[Sidebar] tocHeadings elements not found")
            return
        }

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

        this.bindEvents()
        this.createHrefAttr()
        this.createIdsAttr()

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
    bindEvents = () => {
        this.tocLinks.forEach((link) => {
            link.addEventListener('click', this.activatedLink)
        })
    }
    createHrefAttr = () => {
        this.tocLinks.forEach((link, index) => {
            link.href = `#${this.attrName}-${index}`
        })
    }
    createIdsAttr = () => {
        this.tocHeadings.forEach((heading, index) => {
            heading.id = `${this.attrName}-${index}`
        })
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
