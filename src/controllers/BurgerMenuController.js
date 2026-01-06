export class BurgerMenuController {
  constructor(controllerName, container) {
    this.init()
  }
  init = () => {
    const burgerMenu = document.getElementById('burgerMenu');
    const sidebar = document.getElementById('sidebar-burger-menu');
    const overlay = document.getElementById('overlay');

    // Открытие/закрытие sidebar
    burgerMenu.addEventListener('click', function() {
      sidebar.classList.toggle('open')
      overlay.classList.toggle('active')
      burgerMenu.classList.toggle('active')

      // Блокировка скролла при открытом sidebar
      document.body.style.overflow = sidebar.classList.contains('open')
        ? 'hidden' :
        ''
    })

    // Закрытие sidebar при клике на overlay
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      burgerMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}