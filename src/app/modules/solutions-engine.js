/*
=====================================================
K·ART·MAKE V5.2

SOLUTIONS ENGINE

Card reveal system

=====================================================
*/
export default class SolutionsEngine {
  constructor(){
    this.cards = document.querySelectorAll(".solution-card");

    this.classActive = 'reveal-item'
  }

  start() {
    this.init();
  }

  init(){
    this.cards.forEach(card=>{
      ScrollTrigger.create({
        trigger:card,
        start: "top 70%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse",
        onEnter: () => {
          card.classList.add(this.classActive);
        },
        onLeave: () => {
          card.classList.remove(this.classActive);
        },
        onEnterBack: () => {
          card.classList.add(this.classActive);
        },
        onLeaveBack: () => {
          card.classList.remove(this.classActive);
        }
      });
    });
  }
}
