export class SidebarAnchorController {
  constructor(controllerName, container) {
    this.init()
  }
  init = () => {
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const sections = document.querySelectorAll('[data-id]')
    const sidebarLinks = document.querySelectorAll('.sidebar__nav a');

    // Плавная прокрутка при клике на ссылки в sidebar
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');

        console.log(targetId)

        const targetSection = document.querySelector(`[data-id="${targetId.substring(1)}"]`);

        console.log(targetSection)

        if (targetSection) {
          // Плавная прокрутка к секции
          window.scrollTo({
            top: targetSection.offsetTop - headerHeight - 60,
            behavior: 'smooth'
          });
        }
      });
    });

    window.addEventListener('scroll', function() {
      let current = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;

        if (pageYOffset >= sectionTop - headerHeight - 60) {
          current = section.dataset.id;
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