import { AnimatedSprite, Container, Rectangle, Texture } from "pixi.js";

export default class CoinsDrop extends Container {
  constructor(props) {
    super()

    this.app = props.app
    this.assets = props.assets

    let commonFrames = []
    let w = 800
    for(let i=0; i<11; i++) {
      let rect = new Rectangle(w*i, 0, w, w)
      let texture = new Texture({
        source: this.assets.coinDropAnimation,
        frame: rect
      })
      commonFrames.push(texture)
    }

    this.animation = new AnimatedSprite(commonFrames)
    this.animation.anchor.set(0.5)
    this.animation.loop = true
    this.animation.animationSpeed = 1
    this.addChild(this.animation)
  }

  play() {
    this.animation.play()
  }
}
