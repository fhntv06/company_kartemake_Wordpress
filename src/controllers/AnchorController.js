export class AnchorController {
  constructor(controllerName, container) {
    this.items = Array.from(container.querySelectorAll(`[data-controller-${controllerName}="item"]`))

    if (!this.items.length) {
        throw new Error(`No have controller items in ${controllerName}`)
    }

    this.scrollHintText = document.getElementById('scroll-hint')
    this.duration = 1000 // продолжительность анимации в мс

    this.init()
  }
  init = () => {
    this.items.forEach((link) => link.addEventListener('click', this.anchorHandler))

    const scrollHintText = this.scrollHintText
    if (scrollHintText) {
      window.addEventListener('scroll', function() {
        (window.pageYOffset > 300)
          ? scrollHintText.classList.add('hidden')
          : scrollHintText.classList.remove('hidden')
      })
    }

    this.handleHashOnLoad();
  }
  handleHashOnLoad = () => {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Даём время на полную загрузку страницы и рендеринг
        setTimeout(() => {
          this.scrollToElement(targetElement);
        }, 500);
      }
    }
  }
  scrollToElement = (element) => {
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const offset = window.innerWidth < 768 ? 32 : 64; // дополнительный отступ

    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerHeight - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };
  anchorHandler = (e) => {
    e.preventDefault();

    const rawHref = e.currentTarget.getAttribute('href');

    // Если ссылка начинается с # — это якорь на текущей странице
    if (rawHref.startsWith('#')) {
      const hash = rawHref.substring(1); // убираем #
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        this.scrollToElement(targetElement);
      }
      return;
    }

    // Разбираем URL на части для ссылок вида page.html#anchor
    const [path, hash] = rawHref.split('#');

    // Если есть якорь и путь не пустой
    if (hash && path) {
      // Получаем имя текущего файла из URL
      const currentFile = window.location.pathname.split('/').pop();
      const targetFile = path.split('/').pop();

      // Если это ссылка на другую страницу
      if (targetFile && targetFile !== currentFile) {
        window.location.href = rawHref;
        return;
      }

      // Ищем элемент с якорем на текущей странице
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        this.scrollToElement(targetElement);
      }
      return;
    }

    // Если есть якорь, но путь пустой (случай #anchor после обработки startsWith)
    if (hash) {
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        this.scrollToElement(targetElement);
      }
    }
  }
}
