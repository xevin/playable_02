import {
  Sprite,
  Container,
  Text,
  Graphics,
  BlurFilter,
} from "pixi.js"
import Config from "./config"
import { gsap } from "gsap/gsap-core"
import { sounds } from "./assets"

export default class SpinnerScene extends Container {
  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets

    this.spinnerRollSound = new Howl({
      src: [
        sounds.spinnerRoll
      ],
      html5: true,
    })
    this.bonusSound = new Howl({
      src: [
        sounds.bonus
      ],
      html5: true,
    })
    this.winSound = new Howl({
      src: [
        sounds.spinnerWin
      ],
      html5: true,
    })
    // тут будет спиннер, и оно будет блюрится
    this.contentContainer = new Container()
    this.contentContainer.label = "contentContainer"
    this.contentContainer.position.x = Config.width / 2
    this.contentContainer.position.y = Config.height / 2

    this.wheel = new Sprite(this.assets.spinnerWheel)
    this.wheel.anchor.set(0.5)
    this.contentContainer.addChild(this.wheel)

    let spinner = new Sprite(this.assets.spinnerFrame)
    spinner.anchor.set(0.5)
    spinner.scale.set(0.98)
    this.contentContainer.addChild(spinner)

    let spinnerCap = new Sprite(this.assets.spinnerCap)
    spinnerCap.anchor.set(0.5)
    this.contentContainer.addChild(spinnerCap)
    this.addChild(this.contentContainer)

    // это будет затемнялка
    this.shadowContainer = new Container()
    this.shadowContainer.label = "shadowContainer"
    this.addChild(this.shadowContainer)
    this.shadow = new Graphics()
    this.shadow.rect(0, 0, Config.width, Config.height).fill(0x000000)
    this.shadow.alpha = 0
    this.shadowContainer.addChild(this.shadow)

    // prize message
    this.prizeContainer = new Container()
    this.addChild(this.prizeContainer)
    this.prizeContainer.position.x = Config.width / 2
    this.prizeContainer.position.y = Config.height / 2
    this.bonusText = new Text({
      text: "x66",
      style: {
        ...Config.fontStyles,
        fill: "#ffe02c",
        fontSize: 180,
        align: "center"
      }
    })
    this.bonusText.anchor.set(0.5)
    this.bonusText.scale.set(0)
    this.prizeContainer.addChild(this.bonusText)
  }

  show() {
    console.log("spinner show")
    this.bonusSound.play()
    this.contentContainer.scale.set(0)
    this.visible = true
    gsap.to(this.contentContainer, {
      scale: 1,
      duration: 0.7,
      ease: "power4.out",
    }).eventCallback("onComplete", () => {
      this.emit("afterShow")
    })
  }

  spinWheel() {
    const angleToX66 = 2970
    this.spinnerRollSound.play()
    // howl play here "casino short roulette spin mp3"

    gsap.to(this.wheel, {
      angle: angleToX66,
      duration: 2,
      ease: "sine"
    }).eventCallback("onComplete", async () => {
      this.wheel.angle = 45+45
      this.spinnerRollSound.stop()
      this.winSound.play()
      await this.showPrize()
      this.emit("spinnerDone")
    })
  }

  async showPrize() {
    this.blurFilter = new BlurFilter()
    this.contentContainer.filters = [this.blurFilter]
    this.blurFilter.blur = 0
    // при качестве 6 не видно "клеток"
    this.blurFilter.quality = 6

    let tl = gsap.timeline()

    this.bonusText.zIndex = 1000
    tl.to(this.bonusText.scale, {
      x: 1,
      y: 1,
      duration: 0.75,
      ease: "elastic.out(1,0.75)",
    }, 0).eventCallback("onComplete", () => {
      console.log("text bonus showed")
    })

    // затемняем фон
    tl.to(this.shadow, {
      alpha: 0.8
    }, 0)

    // размываем фон
    tl.to(this.blurFilter, {
      strength: 20
    }, 0)

    // улетаем вверх
    tl.to(this.bonusText.scale, {
      x: 0.2,
      y: 0.2
    }, 0.8)
    tl.to(this.bonusText.position, {
      y: -470,
      ease: "power1.in",
      duration: "0.3",
    }, 0.8)

    await tl
    this.emit("bonusAnimationEnd")
    this.fadeOut()
  }

  fadeOut() {
    console.log("SlotScene скрываемся")
    gsap.to(this, {
      alpha: 0,
      duration: 0.3
    })
  }
}
