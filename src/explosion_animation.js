import { Container, AnimatedSprite, Texture, Rectangle } from "pixi.js"

export default class ExplosionAnimation extends Container {
  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets

    let frames = []
    let sizeX = 200
    let sizeY = 200

    for(let i=0; i<17; i++) {
      let frame = new Texture({
        source: this.assets.explosionAnimation,
        frame: new Rectangle(i * sizeX, 0, sizeX, sizeY)
      })
      frames.push(frame)
    }
    this.box = new AnimatedSprite(frames)
    this.box.anchor.set(0.5)
    this.box.scale.set(2)
    this.box.loop = false
    this.box.animationSpeed = 0.5
    this.addChild(this.box)
  }

  playAnimation() {
    this.box.play()
  }
}
