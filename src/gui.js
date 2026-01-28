import { Container, Graphics, Sprite, BlurFilter, Text } from "pixi.js"
import { gsap } from "gsap/gsap-core"
import Config from "./config"


export default class Gui extends Container {
  balanceValue = 0.0
  balanceText

  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets

    let balance = new Sprite(this.assets.balance)
    balance.anchor.set(0.5, 0)
    balance.scale.set(0.63)

    balance.position.x = Config.width / 2
    balance.position.y = 48
    this.addChild(balance)

    this.balanceText =  new Text({
      text: "$ " + this.balanceValue,
      style: {
        ...Config.fontStyles,
        fontSize: 60
      },
    })
    this.balanceText.anchor.set(0.5)
    this.balanceText.position.x = Config.width / 2
    this.balanceText.position.y = 100
    this.addChild(this.balanceText)

    this.spinButtonWrap = new Container()
    this.spinButtonWrap.position.x = Config.width / 2
    this.spinButtonWrap.position.y = Config.height - 60

    let spinButtonBlur = new Sprite(this.assets.spinButton)
    spinButtonBlur.anchor.set(0.5, 1)
    spinButtonBlur.scale.set(0.6)
    spinButtonBlur.filters = [new BlurFilter({ strength: 15 })]
    spinButtonBlur.eventMode = "none"

    let spinButton = new Sprite(this.assets.spinButton)
    spinButton.anchor.set(0.5, 1)
    spinButton.scale.set(0.6)
    spinButton.eventMode = "static"

    this.spinButtonWrap.addChild(spinButtonBlur)
    this.spinButtonWrap.addChild(spinButton)
    this.addChild(this.spinButtonWrap)
    spinButton.on("pointerdown", async () => {
      this.onSpinButtonPressed()
    })

    let spinText =  new Text({
      text: "SPIN",
      style: {
        ...Config.fontStyles,
        fontSize: 64
      }
    })
    spinText.anchor.set(0.5)
    spinText.position.y = -45
    spinText.eventMode = "none"
    this.spinButtonWrap.addChild(spinText)

  }

  animateBalanceTo(value) {
    gsap.to(this, {
      balanceValue: value
    }).eventCallback("onUpdate", () => {
      this.balanceText.text = "$ " + parseFloat(this.balanceValue).toFixed(2)
    })
  }

  async onSpinButtonPressed() {
    await gsap.to(this.spinButtonWrap.scale, {
      x: 0.9,
      y: 0.9,
      duration: 0.1,
    })

    this.emit("spinpressed")

    await gsap.to(this.spinButtonWrap.scale, {
      x: 1.0,
      y: 1.0,
      ease: "elastic.out(0.9)",
      duration: 1
    })
  }
}
