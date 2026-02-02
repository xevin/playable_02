import { BlurFilter, Container, Graphics, Sprite, Text } from "pixi.js"
import CoinsDrop from "./coins_drop_animation";
import Config from "./config"
import { gsap } from "gsap/gsap-core"
import { sounds } from "./assets"
import { triggerSDKDownload } from "./utils"

export default class WinScene extends Container {
  balanceValue = 700

  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets

    this.clickSound = new Howl({
      src: [
        sounds.click
      ],
      html5: true,
    })
    this.winSound = new Howl({
      src: [
        sounds.win
      ],
      html5: true,
    })

    this.bg = new Graphics()
    this.bg.rect(-3000, -3000, 6000, 6000)
    this.bg.fill(0x000000)
    this.bg.alpha = 0
    this.addChild(this.bg)

    this.coins = new CoinsDrop({app: this.app, assets: this.assets})
    this.coins.position.x = Config.width / 2
    this.coins.position.y = Config.height / 2 - 300
    this.coins.play()
    this.coins.scale.set(2.4)
    this.addChild(this.coins)

    this.container = new Container()
    this.container.position.x = Config.width / 2
    this.container.position.y = Config.height / 2
    this.addChild(this.container)

    // лучи
    this.lights = new Sprite(this.assets.lights)
    this.lights.anchor.set(0.5)
    this.lights.scale.set(2)
    this.lights.alpha = 0.7
    this.lights.position.y = -100
    this.lights.filters = [new BlurFilter({strength: 30, quality: 7})]
    this.container.addChild(this.lights)

    this.bigWin = new Sprite(this.assets.bigWin)
    this.bigWin.anchor.set(0.5)
    this.bigWin.scale.set(0)
    this.bigWin.position.y = -150
    this.container.addChild(this.bigWin)

    this.coinContainer = new Container()
    this.coinContainer.position.y = 165
    this.coinContainer.scale.set(0)

    this.coinBalance = new Sprite(this.assets.balance)
    this.coinBalance.anchor.set(0.5)
    this.coinBalance.scale.set(0.67)
    this.coinContainer.addChild(this.coinBalance)

    this.coinText = new Text({
      text: "$ " + this.balanceValue,
      style: {
        ...Config.fontStyles,
        fontSize: 60,
        align: "center"
      },
    })
    this.coinText.anchor.set(0.5)
    this.coinContainer.addChild(this.coinText)

    this.container.addChild(this.coinContainer)

    this.installButton = new Sprite(this.assets.installButton)
    this.installButton.label = "InstallButton"
    this.installButton.anchor.set(0.5)
    this.installButton.scale.set(0)
    this.installButton.position.y = 360
    this.installButton.eventMode = "dynamic"
    this.installButton.on("pointerdown", () => {
      console.log("Playable переход куда надо")
      this.clickSound.play()
      window.fbPlayableAd.onCTAClick()
      // triggerSDKDownload()
    })
    this.container.addChild(this.installButton)
  }

  show() {
    this.winSound.play()
    this.visible = true

    let tl = gsap.timeline()

    tl.to(this.bg, {
      alpha: 0.4
    }, 0)

    this.coinContainer.scale.set(0)
    tl.to(this.coinContainer.scale,
      {
        x: 1,
        y: 1,
        ease: "power1.inOut",
        duration: 0.7
      },
      0
    )

    tl.to(this, {
      balanceValue: 46200,
      ease: "power1.inOut",
      duration: 1.5,
      stagger: {
        onUpdate: () => {
          this.coinText.text = "$ " + parseFloat(this.balanceValue).toFixed(2)
        }
      }
    }, 0)

    let toScale = 0.92
    tl.to(this.bigWin.scale, {
      x: toScale,
      y: toScale,
      ease: "elastic.out(1,0.75)",
      duration: 1,
    }, 0)

    tl.to(this.installButton.scale, {
      x: 1,
      y: 1,
      ease: "elastic.out(1,0.75)",
      duration: 0.8,
    }, 0.8)

    tl.to(this.bigWin, {
      x: this.bigWin.position.x + 20,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 2,
    }, 0.7)
    tl.fromTo(this.bigWin, {
      y: this.bigWin.position.y - 10,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 1,
    },{
      y: this.bigWin.position.y + 10,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 1,
    }, 0.7)

    tl.fromTo(this.bigWin, {
      angle: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 1,
    },
    {
      angle: -2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 0.9
    }, 0.7)

    // -- INSTALLATION BUTTON
    let installButtonStart = 1
    tl.fromTo(this.installButton.scale, {
      y: 0.9,
      yoyo: true,
      repeat: -1,
      duration: 0.2,
      ease: "power1.inOut",
    }, {
      y: 1,
      yoyo: true,
      repeat: -1,
      duration: 0.2,
      ease: "power1.inOut",
    }, installButtonStart)

    tl.fromTo(this.installButton, {
      y: this.installButton.position.y - 10,
      yoyo: true,
      repeat: -1,
      duration: 0.35,
      ease: "power1.inOut",
    }, {
      y: this.installButton.position.y + 10,
      yoyo: true,
      repeat: -1,
      duration: 0.35,
      ease: "power1.inOut",
    }, installButtonStart)

    tl.fromTo(this.installButton, {
      x: this.installButton.position.x - 5,
      yoyo: true,
      repeat: -1,
      duration: 0.5,
      ease: "power1.inOut",
    }, {
      x: this.installButton.position.x + 5,
      yoyo: true,
      repeat: -1,
      duration: 0.4,
      ease: "power1.inOut",
    }, installButtonStart)

    tl.fromTo(this.installButton, {
      angle: -1,
      yoyo: true,
      repeat: -1,
      duration: 0.3,
      ease: "power1.inOut",
    }, {
      angle: 2,
      yoyo: true,
      repeat: -1,
      duration: 0.3,
      ease: "power1.inOut",
    }, installButtonStart)

    this.coins.play()
  }
}
