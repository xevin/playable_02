import {
  Sprite,
  Container,
  Text,
} from "pixi.js"
import Config from "./config"
import { gsap } from "gsap/gsap-core"

export default class Spinner extends Container {
  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets

    this.position.x = Config.width / 2
    this.position.y = Config.height / 2

    this.wheel = new Sprite(this.assets.spinnerWheel)
    this.wheel.anchor.set(0.5)
    this.addChild(this.wheel)

    let spinner = new Sprite(this.assets.spinnerFrame)
    spinner.anchor.set(0.5)
    spinner.scale.set(0.98)
    this.addChild(spinner)

    let spinnerCap = new Sprite(this.assets.spinnerCap)
    spinnerCap.anchor.set(0.5)
    this.addChild(spinnerCap)
  }

  show() {
    console.log("spinner show")
    this.scale.set(0)
    this.visible = true
    gsap.to(this, {
      scale: 1,
      duration: 0.7,
      ease: "power4.out",
    }).eventCallback("onComplete", () => {
      this.emit("afterShow")
    })
  }

  spinWheel() {
    const angleToX66 = 2970

    // howl play here "casino short roulette spin mp3"

    gsap.to(this.wheel, {
      angle: angleToX66,
      duration: 2,
      ease: "sine"
    }).eventCallback("onComplete", async () => {
      this.wheel.angle = 45+45
      await this.showPrize()
      this.emit("spinnerDone")
    })
  }

  async showPrize() {
    let bonusText = new Text({
      text: "x66",
      style: {
        ...Config.fontStyles,
        fill: "#ffe02c",
        fontSize: 180,
        align: "center"
      }
    })
    bonusText.anchor.set(0.5)
    bonusText.scale.set(0)
    this.addChild(bonusText)

    gsap.to(bonusText.scale, {
      x: 1,
      y: 1,
      duration: 0.3,
      ease: "power4.in",
    }).eventCallback("onComplete", () => {
      console.log("text bonus showed")
    })
  }
}
