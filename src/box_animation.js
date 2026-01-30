import { Container, AnimatedSprite, Texture, Rectangle } from "pixi.js"

export default class BoxAnimation extends Container {
  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets

    let frames = []
    let sizeX = 128
    let sizeY = 128
    for(let i=0; i<23; i++) {
      let frame = new Texture({
        source: this.assets.boxOpenAnimation,
        frame: new Rectangle(i * sizeX, 0, sizeX, sizeY)
      })
      frames.push(frame)
    }
    this.box = new AnimatedSprite(frames)
    this.box.loop = false
    this.box.animationSpeed = 0.5
    this.addChild(this.box)
  }

  playBoxAnimation() {
    this.box.play()
  }
}
