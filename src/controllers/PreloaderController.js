export class PreloaderController {
  constructor() {
    this.preloader = document.querySelector('.preloader');
    this.text = document.querySelector('.preloader__text');
    this.stroke = document.querySelector('.preloader__stroke');
    this.body = document.body;
    this.init();
  }

  init = () => {
    if (!this.preloader) return;
    this.lockScroll();
    window.addEventListener('load', this.onLoad);
  }

  lockScroll = () => {
    this.body.classList.add('preloader-lock');
  }

  unlockScroll = () => {
    this.body.classList.remove('preloader-lock');
  }

  onLoad = () => {
    // Запуск анимации SVG
    this.stroke.style.animationPlayState = 'running';
    setTimeout(() => {
      this.text.classList.add('preloader__text--active');
      setTimeout(this.hidePreloader, 700);
    }, 2000); // после завершения dash
  }

  hidePreloader = () => {
    this.preloader.classList.add('preloader--hidden');
    setTimeout(() => {
      this.preloader.remove();
      this.unlockScroll();
    }, 1000); // время transition
  }
}