export default class Terminal {
  constructor() {
    console.log("[Terminal] ready")
    this.hero = document.querySelector(".hero-terminal");
    this.audit = document.querySelector(".audit-terminal");
    this.contact = document.querySelector(".contact-terminal");
    this.started = {
      hero: false,
      audit: false,
      contact: false
    };
    this.init();
  }

  init() {
    window.addEventListener("sceneChange", event => {
      const scene = event.detail?.scene;
      if (scene === "hero") {
        this.startHero();
      }
      if (scene === "audit") {
        this.startAudit();
      }
      if (scene === "contact") {
        this.startContact();
      }
    });
  }

  startHero() {
    if (this.started.hero) return;
    this.started.hero = true;
    this.run(this.hero, [
      { text: "Инициализация системы...", status: "OK" },
      { text: "Соединительная инфраструктура...", status: "DONE" },
      { text: "Сервер онлайн", status: "RUNNING" },
      { text: "Приложение развернуто", status: "SUCCESS" },
      { text: "База данных подключена", status: "ACTIVE" },
      { text: "Активный мониторинг", status: "ONLINE" }
    ]);
  }

  startAudit() {
    if (this.started.audit) return;
    this.started.audit = true;
    this.run(this.audit, [
      { text: "Начало аудита сайта...", status: "RUNNING" },
      { text: "Сканирование страниц...", status: "DONE" },
      { text: "Проверка технической структуры...", status: "OK" },
      { text: "Анализ соответствия требованиям...", status: "OK" },
      { text: "Выявление потенциальных проблем...", status: "DONE" },
      { text: "Аудит завершен.", status: "SUCCESS" }
    ]);
  }

  startContact() {
    if (this.started.contact) return;
    this.started.contact = true;
    this.run(this.contact, [
      { text: "статус проекта", status: "READY" },
      { text: "инфраструктура", status: "OPERATIONAL" },
      { text: "мониторинг", status: "ACTIVE" },
      { text: "следующее действие", status: "CONTACT_TEAM" }
    ]);
  }

  async run(terminal, messages) {
    if (!terminal) return;

    const body = terminal.querySelector(".terminal-body");
    if (!body) {
      console.warn("[Terminal] Terminal body not found");
      return;
    }

    // Полностью очищаем body
    body.innerHTML = "";

    // Добавляем новые строки
    for (let i = 0; i < messages.length; i++) {
      const { text, status } = messages[i];

      // Создаем строку как в статичном HTML
      const line = document.createElement("div");
      const isLast = i === messages.length - 1;
      line.className = `terminal-line${isLast ? ' terminal-line-accent' : ''}`;

      // Структура как в статичном HTML:
      // <span class="terminal-prompt">&gt;</span>
      // <span>текст</span>
      // <strong>СТАТУС</strong>
      const prompt = document.createElement("span");
      prompt.className = "terminal-prompt";
      prompt.textContent = ">";

      const textSpan = document.createElement("span");
      textSpan.textContent = text;

      const statusStrong = document.createElement("strong");
      statusStrong.textContent = status;

      line.appendChild(prompt);
      line.appendChild(textSpan);
      line.appendChild(statusStrong);

      body.appendChild(line);

      // Эффект печати для текста
      await this.typeText(textSpan, text, 50);

      // Появление статуса
      await this.wait(300);
      statusStrong.style.opacity = "0";
      statusStrong.style.transition = "opacity 0.3s ease";
      requestAnimationFrame(() => {
        statusStrong.style.opacity = "1";
      });

      body.scrollTop = body.scrollHeight;
    }
  }

  // Эффект печатающегося текста
  typeText(element, text, speed = 50) {
    return new Promise(resolve => {
      let index = 0;
      element.textContent = "";

      const interval = setInterval(() => {
        if (index < text.length) {
          element.textContent += text[index];
          index++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}