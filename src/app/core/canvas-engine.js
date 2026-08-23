/*
=====================================================
K·ART·MAKE V5.2

CANVAS ENGINE

Particle infrastructure renderer

=====================================================
*/
export default class CanvasEngine {
  constructor() {
    console.log("[CanvasEngine] ready")
    this.scene = document.querySelector(".scene-hero");
    this.canvas = document.getElementById("heroCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.particles = [];
    this.mouse = {
      x:0,
      y:0,
    };

    this.resize();
    this.createParticles();

    this.scene.addEventListener("sceneActivated", () => this.start())
    this.scene.addEventListener("sceneDeactivated", () => this.stop())
  }

  start(){
    this.bindEvents();
    this.animate();
  }
  stop() {
    window.removeEventListener("resize", ()=>this.resize());

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resize(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticles(){
    const count = 120;
    for(let i=0;i<count;i++){
      this.particles.push({
        x: Math.random()*this.width,
        y: Math.random()*this.height,
        size: Math.random()*2+1,
        speed: Math.random()*0.4+0.1,
        alpha: Math.random(),
      });
    }
  }

  bindEvents(){
    window.addEventListener("resize", ()=>this.resize());
  }

  draw(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach(p=>{
      p.y -= p.speed;
      if(p.y<0){
        p.y=this.height;
      }
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      this.ctx.fillStyle = `rgba(255,107,0,${p.alpha})`;
      this.ctx.fill();
    });
  }

  animate(){
    this.draw();
    this.animationId = requestAnimationFrame(()=>this.animate());
  }
}
