export default class AuditEngine {
  constructor() {
    console.log("[AuditEngine] ready")

    this.section = document.querySelector('[data-scene="audit"]');
    this.started = false;
    this.initialized = false;

    this.start()
  }

  start() {
    if (this.started) return;
    this.started = true;
    console.log("[AuditEngine] started");
    /*
     * Здесь запускается сама
     * анимация / анализатор audit-сцены.
     */
    this.initialized = true;
    if (!this.section) return;
    this.section.classList.add("audit-active");
    // дальнейшая логика Audit Engine
  }
}