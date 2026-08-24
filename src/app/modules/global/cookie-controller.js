/*
==========================================================
K·ART·MAKE V5.2
COOKIE CONTROLLER
==========================================================

Responsibilities:

- Cookie consent
- Analytics consent
- Cookie banner state
- Cookie settings
- LocalStorage persistence

==========================================================
*/
export default class CookieController {
  constructor() {
    console.log("[CookieController] ready")
    this.banner = document.querySelector("#cookie-banner");
    if (!this.banner) {
      throw new Error(`[CookieController] Banner not found!`);
    }
    /*
    ====================================================
    DOM
    ====================================================
    */
    this.content = this.banner.querySelector(".cookie-banner__content");
    this.acceptBtn = this.banner.querySelector("#cookie-accept");
    this.declineBtn = this.banner.querySelector("#cookie-decline");
    this.validate();
    /*
    ====================================================
    STATE
    ====================================================
    */
    this.isVisible = false;
    this.currentStep = 1;
    /*
    ====================================================
    INIT
    ====================================================
    */
    this.init();
  }

  /*
  ========================================================
  VALIDATE
  ========================================================
  */
  validate() {
    const required = {
      content: this.content,
      acceptBtn: this.acceptBtn,
      declineBtn: this.declineBtn,
    };
    Object.entries(required).forEach(([name, element]) => {
      if (!element) {
        throw new Error(`[CookieController] Missing element: ${name}`);
      }
    });
  }

  /*
  ========================================================
  INIT
  ========================================================
  */
  init() {
    this.showBanner();
    this.bindEvents();
  }

  /*
  ========================================================
  STORAGE
  ========================================================
  */
  getSavedConsent() {
    const raw = localStorage.getItem("cookie_consent");
    if (!raw) {
      return null;
    }
    try {
      const consent = JSON.parse(raw);
      if (typeof consent !== "object" || consent === null) {
        return null;
      }
      return {
        analytics: Boolean(consent.analytics),
        date: consent.date || null
      };
    } catch (error) {
      console.warn("[CookieController] Failed to parse saved consent", error);
      localStorage.removeItem("cookie_consent");
      return null;
    }
  }

  saveConsent(consent) {
    const data = {
      analytics: Boolean(consent?.analytics),
      date: new Date().toISOString()
    };
    localStorage.setItem("cookie_consent", JSON.stringify(data));
  }

  /*
  ========================================================
  BANNER
  ========================================================
  */
  showBanner() {
    this.banner.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      this.banner.classList.add("cookie-banner--show");
    });
  }

  hideBanner() {
    this.saveConsent()
    this.banner.classList.remove("cookie-banner--show");
    this.banner.setAttribute("aria-hidden", "true");
  }
  /*
  ========================================================
  CONSENT
  ========================================================
  */
  applyConsent(consent) {
    const analyticsEnabled = Boolean(consent?.analytics);
    if (analyticsEnabled) {
      this.activateAnalytics();
    } else {
      this.deactivateAnalytics();
    }
  }

  /*
  ========================================================
  ANALYTICS
  ========================================================
  */
  activateAnalytics() {
    console.log("[CookieController] Analytics enabled");
    /*
    Здесь подключаем Яндекс.Метрику.
    */
  }
  deactivateAnalytics() {
    console.log("[CookieController] Analytics disabled");
  }
  /*
  ========================================================
  EVENTS
  ========================================================
  */
  bindEvents() {
    this.acceptBtn.addEventListener("click", () => this.hideBanner());
    this.declineBtn.addEventListener("click", () => this.hideBanner());
  }
}
