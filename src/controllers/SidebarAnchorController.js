export class SidebarAnchorController {
  constructor() {
    this.init()
  }
  init = () => {
    const sections = document.querySelectorAll('section[href^="#"]')
    const burgerMenu = document.getElementById('burgerMenu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    // Открытие/закрытие sidebar
    burgerMenu.addEventListener('click', function() {
      sidebar.classList.toggle('open')
      overlay.classList.toggle('active')
      burgerMenu.classList.toggle('active')

      // Блокировка скролла при открытом sidebar
      if (sidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    })

    // Закрытие sidebar при клике на overlay
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      burgerMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    // Плавная прокрутка при клике на ссылки в sidebar
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          // Закрываем sidebar после выбора пункта
          sidebar.classList.remove('open');
          overlay.classList.remove('active');
          burgerMenu.classList.remove('active');
          document.body.style.overflow = 'auto';

          // Плавная прокрутка к секции
          window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    window.addEventListener('scroll', function() {
      let current = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }
}