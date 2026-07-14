import { BlobSvgController } from "./BlobSvgController.js";

export class BlobClusterController {
  constructor(controllerName, container) {
    this.scene = container;

    if (!this.scene) {
      console.error(`[CursorController] - No item found for controller: ${controllerName}`)
      return
    }

    this.labels = ["аудит", "разработка", "поддержка"];

    this.orbs = [];

    this.mouse = { x: 0, y: 0, inside: false };

    this.animationFrame = null;

    this.init();
  }

  init() {

    const computedPos = window.getComputedStyle(this.scene).position;
    if (computedPos === "static") {
      this.scene.style.position = "relative";
    }

    const rect = this.scene.getBoundingClientRect();

    this.sceneWidth = rect.width;
    this.sceneHeight = rect.height;

    // размер одного "шарика" — подстраивается под размер сцены
    const size = Math.min(this.sceneWidth, this.sceneHeight) * 0.52;

    // стартовые позиции — распределяем треугольником, чтобы не накладывались сразу
    const startPositions = [
      { x: this.sceneWidth * 0.10, y: this.sceneHeight * 0.12 },
      { x: this.sceneWidth * 0.46, y: this.sceneHeight * 0.50 },
      { x: this.sceneWidth * 0.18, y: this.sceneHeight * 0.62 }
    ];

    for (let i = 0; i < 3; i++) {

      const wrapper = document.createElement("div");
      wrapper.className = "blob-orb";
      wrapper.dataset.label = this.labels[i] || "";

      wrapper.style.position = "absolute";
      wrapper.style.width = `${size}px`;
      wrapper.style.height = `${size}px`;
      wrapper.style.borderRadius = "50%";
      wrapper.style.left = "0px";
      wrapper.style.top = "0px";
      wrapper.style.willChange = "transform";
      wrapper.style.pointerEvents = "auto";

      this.scene.appendChild(wrapper);

      const caption = document.createElement("span");
      caption.className = "blob-orb-label";
      caption.textContent = this.labels[i] || "";
      wrapper.appendChild(caption);

      const blob = new BlobSvgController(`blob-orb-${i}`, wrapper);

      const start = startPositions[i] || { x: 0, y: 0 };

      this.orbs.push({
        el: wrapper,
        blob,
        size,
        x: start.x,
        y: start.y,
        // случайное стартовое направление — "своя жизнь"
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        // время для собственного "блуждающего" импульса (раз в N секунд меняет курс)
        wanderTimer: Math.random() * 200
      });
    }

    this.bindEvents();
    this.animate();
  }

  bindEvents() {

    const toLocal = (clientX, clientY) => {
      const r = this.scene.getBoundingClientRect();
      return { x: clientX - r.left, y: clientY - r.top };
    };

    this.scene.addEventListener("mousemove", (e) => {
      const pos = toLocal(e.clientX, e.clientY);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.inside = true;
    });

    this.scene.addEventListener("mouseleave", () => {
      this.mouse.inside = false;
    });

    window.addEventListener("resize", () => {
      const rect = this.scene.getBoundingClientRect();
      this.sceneWidth = rect.width;
      this.sceneHeight = rect.height;
    });
  }

  animate() {

    const loop = () => {
      this.updateCluster();
      this.animationFrame = requestAnimationFrame(loop);
    };

    loop();
  }

  updateCluster() {

    const orbs = this.orbs;

    // === 1. собственное "блуждание" каждого шарика (живёт своей жизнью) ===
    for (const orb of orbs) {

      orb.wanderTimer -= 1;

      if (orb.wanderTimer <= 0) {
        // раз в случайный промежуток времени слегка меняем курс
        orb.vx += (Math.random() - 0.5) * 0.35;
        orb.vy += (Math.random() - 0.5) * 0.35;
        orb.wanderTimer = 120 + Math.random() * 180;
      }

      // ограничение максимальной скорости блуждания
      const maxWander = 0.9;
      const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
      if (speed > maxWander) {
        orb.vx = (orb.vx / speed) * maxWander;
        orb.vy = (orb.vy / speed) * maxWander;
      }
    }

    // === 2. реакция на курсор — шарики "пугаются" и отталкиваются от мыши ===
    if (this.mouse.inside) {

      for (const orb of orbs) {

        const cx = orb.x + orb.size / 2;
        const cy = orb.y + orb.size / 2;

        const dx = cx - this.mouse.x;
        const dy = cy - this.mouse.y;

        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = orb.size * 1.1;

        if (dist < repelRadius && dist > 0.001) {
          const force = (1 - dist / repelRadius) * 1.4;
          orb.vx += (dx / dist) * force;
          orb.vy += (dy / dist) * force;
        }
      }
    }

    // === 3. столкновения шариков друг с другом (упругий отскок) ===
    for (let i = 0; i < orbs.length; i++) {
      for (let j = i + 1; j < orbs.length; j++) {

        const a = orbs[i];
        const b = orbs[j];

        const ax = a.x + a.size / 2;
        const ay = a.y + a.size / 2;
        const bx = b.x + b.size / 2;
        const by = b.y + b.size / 2;

        const dx = bx - ax;
        const dy = by - ay;

        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.001) dist = 0.001;

        // считаем "сталкивающимися" чуть раньше визуального касания,
        // т.к. морф-формы организм мягкий и края гуляют (мягкое перекрытие — ок)
        const minDist = (a.size + b.size) * 0.42;

        if (dist < minDist) {

          const nx = dx / dist;
          const ny = dy / dist;

          // разводим в стороны пропорционально перекрытию
          const overlap = (minDist - dist) / 2;

          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;

          // упругий обмен скоростью вдоль нормали столкновения
          const avn = a.vx * nx + a.vy * ny;
          const bvn = b.vx * nx + b.vy * ny;

          const diff = bvn - avn;

          a.vx += nx * diff * 0.5;
          a.vy += ny * diff * 0.5;
          b.vx -= nx * diff * 0.5;
          b.vy -= ny * diff * 0.5;
        }
      }
    }

    // === 4. отскок от границ .scene ===
    for (const orb of orbs) {

      if (orb.x < 0) {
        orb.x = 0;
        orb.vx = Math.abs(orb.vx);
      }
      if (orb.y < 0) {
        orb.y = 0;
        orb.vy = Math.abs(orb.vy);
      }
      if (orb.x + orb.size > this.sceneWidth) {
        orb.x = this.sceneWidth - orb.size;
        orb.vx = -Math.abs(orb.vx);
      }
      if (orb.y + orb.size > this.sceneHeight) {
        orb.y = this.sceneHeight - orb.size;
        orb.vy = -Math.abs(orb.vy);
      }
    }

    // === 5. лёгкое глобальное затухание, чтобы скорость не накапливалась бесконечно ===
    for (const orb of orbs) {
      orb.vx *= 0.985;
      orb.vy *= 0.985;
    }

    // === 6. применяем позицию ===
    for (const orb of orbs) {
      orb.x += orb.vx;
      orb.y += orb.vy;

      orb.el.style.transform = `translate3d(${orb.x}px, ${orb.y}px, 0)`;
    }
  }

  destroy() {

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    for (const orb of this.orbs) {
      orb.blob.destroy();
      if (orb.el.parentNode) orb.el.parentNode.removeChild(orb.el);
    }

    this.orbs = [];
  }
}