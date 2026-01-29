import { Container, Graphics, Sprite, BlurFilter, Text } from "pixi.js"
import { gsap } from "gsap/gsap-core"
import Config from "./config"
import { Howl } from "howler"
import { sounds } from "./assets"

export default class Gui extends Container {
  balanceValue = 0.0
  balanceText
  isSpinButtonLocked = false

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

    this.pointer = new Sprite(this.assets.pointer)
//    this.pointer.scale.set(0.1)
    this.pointer.position.x = 950
    this.pointer.position.y = 980
    this.pointer.angle = -25
    this.addChild(this.pointer)

    this.clickSound = new Howl({
      src: [
        sounds.click
      ],
      html5: true,
    })
    this.coinsAddSound = new Howl({
      src: [
        sounds.coinsAdd
      ],
      html5: true,
    })

    // Анимация пальца
    gsap.to(this.pointer, {
      x: this.pointer.x + 20,
      y: this.pointer.y + 80,
      yoyo: true,
      repeat: -1,
      duration: 0.25,
      ease: "power1.inOut(0.4)"
    })
  }

  show() {
    // появление спиннера
    console.log("spinner show()")
  }

  setSpinButtonLocked(value) {
    this.isSpinButtonLocked = value

    // DEBUG
//    this.spinButtonWrap.alpha = value ? 0.5 : 1
//    console.log("set locked?", value)

    this.pointer.visible = !value
  }

  hide() {
    this.visible = false
  }

  setBalance(value) {
    this.balanceValue = value
    this.balanceText.text = "$ " + parseFloat(this.balanceValue).toFixed(2)
  }

  async animateBalanceTo(value, duration=1.0) {
    if (this.balanceValue != value) {
      this.coinsAddSound.play()
    }

    await gsap.to(this, {
      balanceValue: value,
      duration,
    }).eventCallback("onUpdate", () => {
      this.balanceText.text = "$ " + parseFloat(this.balanceValue).toFixed(2)
      this.emit("balanceUpdated")
    })
    this.coinsAddSound.stop()
  }

  async onSpinButtonPressed() {
    if (this.isSpinButtonLocked) {
      console.log("gui spin button is locked")
      return
    }

    this.clickSound.play()

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
