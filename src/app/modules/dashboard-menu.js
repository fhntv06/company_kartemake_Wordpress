export default class DashboardMenu {
  constructor() {
    this.dashboard = document.querySelector(".global-dashboard");
    this.button = document.querySelector(".dashboard-menu");
    this.panel = document.querySelector(".dashboard-menu-panel");
    if (!this.dashboard || !this.button || !this.panel) {
      return;
    }
    this.init();
  }

  init() {
    this.button.addEventListener("click", () => {
      this.toggle();
    });
    this.panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        this.close();
      });
    });
    document.addEventListener("click", (event) => {
      if (!this.dashboard.contains(event.target)) {
        this.close();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.close();
      }
    });
  }

  toggle() {
    const isOpen = this.button.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.button.setAttribute("aria-expanded", "true");
    this.panel.classList.add("is-open");
    this.panel.setAttribute("aria-hidden", "false");
    lenis.stop();
  }

  close() {
    this.button.setAttribute("aria-expanded", "false");
    this.panel.classList.remove("is-open");
    this.panel.setAttribute("aria-hidden", "true");
    lenis.start();
  }
}