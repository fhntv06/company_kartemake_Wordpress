export default class DashboardMenu {
  constructor() {
    console.log("[DashboardMenu] ready")

    this.dashboard = document.querySelector(".global-dashboard");
    if (!this.dashboard) {
      console.warn("[DashboardMenu] Dashboard not found!")
      return
    }

    this.button = document.querySelector(".dashboard-menu");
    if (!this.button) {
      console.warn("[DashboardMenu] dashboard-menu button not found!")
      return
    }

    this.panel = document.querySelector(".dashboard-menu-panel");
    if (!this.panel) {
      console.warn("[DashboardMenu] dashboard-menu-panel not found!")
      return
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