export class MarqueeController {
  constructor() {
    this.track = document.querySelector('.marquee-track')

    this.init()
  }

  init = () => {
    if (!this.track) return

    this.track.setAttribute('data-play-state', 'running')
  }
}