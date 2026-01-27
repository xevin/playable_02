import { Container, Sprite } from "pixi.js";
import { gsap } from "gsap/gsap-core"

export default class Loadbar extends Container {
  value

  constructor(props) {
    super();

    this.bg = props.bg
    this.fg = props.fg
    this.progress = props.progress
    this.progressMask = props.progressMask
    this.addChild(this.createLoader())
  }

  createLoader() {
    let container = new Container()
    let loaderBg = new Sprite(this.bg)
    loaderBg.anchor.set(0.5)
    container.addChild(loaderBg)

    this.pmask = new Sprite(this.progressMask)
    this.pmask.anchor.set(0, 0.5)
    this.pmask.position.y = 0
    this.pmask.position.x = -270
    container.addChild(this.pmask)

    this.loaderProgress = new Sprite(this.progress)
    this.loaderProgress.anchor.set(1, 0.5)
    this.loaderProgress.position.y = 0
    this.loaderProgress.position.x = (-this.progress.width / 2)
    this.loaderProgress.mask = this.pmask

    this.percentStep = this.loaderProgress.width / 100
    container.addChild(this.loaderProgress)

    let loaderFg = new Sprite(this.fg)
    loaderFg.anchor.set(0.5)
    container.addChild(loaderFg)

    return container
  }

  async animateLoaderProgress(value) {
    this.value = value
    console.log(this.value)

    if (value >= 100) {
      this.value = 100
      // this.emit("full")
    }

    await gsap.to(this.loaderProgress, {
      x: (this.percentStep * this.value) - (this.progress.width / 2),
      duration: 0.6,
      ease: "power1.inOut"
    }).delay(0.3)
  }
}
