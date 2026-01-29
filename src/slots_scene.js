import { Container, Graphics, Sprite, BlurFilter, Text } from "pixi.js";
import { gsap } from "gsap/gsap-core"
import Config from "./config"

export default class SlotsScene extends Container {
  constructor(props) {
    super()

    this.app = props.app
    this.assets = props.assets

    this.z = 0
    this.addChild(this.createGameScene())
  }

  createGameScene() {
    // Общий контейнер
    let container = new Container()

    // контейнер со слотами, лого и фоном
    this.gameContainer = new Container()
    let gameBgContainer = new Container()
    this.bgColor = new Graphics()
      .rect(0, 0, Config.width, Config.height)
      .fill("#000000")
    this.bgColor.alpha = 0
    gameBgContainer.addChild(this.bgColor)
    container.addChild(this.gameContainer)
    container.addChild(gameBgContainer)

    let logo = new Sprite(this.assets.logo)
    logo.position.x = 50
    logo.position.y = Config.height / 6 + 20
    this.gameContainer.addChild(logo)

    let jeff = new Sprite(this.assets.jeff)
    jeff.anchor.set(1, 1)
    jeff.scale.set(0.78)
    jeff.position.x = Config.width + 40
    jeff.position.y = Config.height
    this.gameContainer.addChild(jeff)

    let slotsContainer = new Container()

    let slotsBackground = new Sprite(this.assets.slotsBackground)
    slotsBackground.anchor.set(0.5)
    slotsContainer.addChild(slotsBackground)

    let slotsFrame = new Sprite(this.assets.slotsFrame)
    slotsFrame.anchor.set(0.5)
    slotsContainer.addChild(slotsFrame)

    slotsContainer.position.x = Config.width / 2
    slotsContainer.position.y = Config.height / 2
    slotsContainer.scale.set(0.85)
    this.gameContainer.addChild(slotsContainer)

    return container
  }

  runSlots() {
    console.log("runSlots()")
    setTimeout(() => {
      console.log("slotsStopped()")
      this.emit("slotsStopped")
    }, 1000)
  }

  async fadeUnload() {
    this.blurFilter = new BlurFilter()
    this.gameContainer.filters = [this.blurFilter]
    this.blurFilter.blur = 0
    // при качестве 6 не видно "клеток"
    this.blurFilter.quality = 6

    // Затемняем и блюрим фон
    let tl = gsap.timeline()
    tl.to(this.blurFilter, {
      blur: 20
    }, 0)
    tl.to(this.bgColor, {
      alpha: 0.65,
      duration: 1.2
    }, 0.2)
    await tl
    console.log("spinner end")
  }
}
