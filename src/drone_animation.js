import { Container, Rectangle, Texture, AnimatedSprite } from "pixi.js"
import { gsap } from "gsap/gsap-core"
import ExplosionAnimation from "./explosion_animation"

export default class DroneAnimation extends Container {
  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets

    let frames = []
    let sizeX = 128
    let sizeY = 128
    for(let i=0; i<60; i++) {
      let frame = new Texture({
        source: this.assets.droneAnimation,
        frame: new Rectangle(i * sizeX, 0, sizeX, sizeY)
      })
      frames.push(frame)
    }
    this.box = new AnimatedSprite(frames)
    this.box.loop = false
    this.box.animationSpeed = 1
    this.addChild(this.box)
  }

  playAnimation() {
    this.box.play()
    setTimeout(() => {
      let expl = new ExplosionAnimation({assets: this.assets})
      expl.position.y = 50
      expl.position.x = 64
      this.addChild(expl)
      expl.playAnimation()
    }, 50)
  }
}
