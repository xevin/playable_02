import { Container, Graphics, Sprite, BlurFilter, Text } from "pixi.js";
import { gsap } from "gsap/gsap-core"
import Config from "./config"
import { sounds } from "./assets"
import SlotRoller from "./slot_roller";

export default class SlotsScene extends Container {
  constructor(props) {
    super()

    this.app = props.app
    this.assets = props.assets

    this.z = 0
    this.addChild(this.createGameScene())

    this.slotsRollSound = new Howl({
      src: [
        sounds.slotsRoll
      ],
      html5: true,
    })

    let slotLineContainer = new Container()
    slotLineContainer.label = "SlotLineContainer"
    slotLineContainer.position.x = 635
    slotLineContainer.position.y = 0

    let slotMask = new Graphics() //new Sprite(this.assets.slotsBackground)
    slotMask.label = "SlotMask"
    slotMask.rect(600, 230, 700, 620).fill("#ffffff")
    slotLineContainer.mask = slotMask
    this.gameContainer.addChild(slotMask)
    this.gameContainer.addChild(slotLineContainer)

    this.slotLines = []
    for(let i=0; i<4; i++) {
      let slotLine = new SlotRoller({...props, startIndex: 3 - i + 5})
      slotLine.position.x = i * 175
//      slotLine.position.y = -1172
      this.slotLines.push(slotLine)
      slotLineContainer.addChild(slotLine)
    }
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

  createSlotLine() {
    let container = new Container()
    container.label = "SlotLine"

    for(let i=1; i<8; i++) {
      let slotSprite = new Sprite(this.assets["slot" + i])
      slotSprite.label = "slot" + i
      slotSprite.position.y = i * 128
      container.addChild(slotSprite)
    }

    for(let i=1; i<8; i++) {
      let slotSprite = new Sprite(this.assets["slot" + i])
      slotSprite.label = "slot" + i
      slotSprite.position.y = i * 128 + 896
      container.addChild(slotSprite)
    }
    return container
  }

  runSlots() {
    console.log("runSlots()")
    this.slotsRollSound.play()

    let idx = 0
    let it = setInterval(() => {
      if (idx >= 4) {
        clearInterval(it)
        return
      }
      console.log("idx", idx)
      let slotLine = this.slotLines[idx]
      slotLine.rollTo(slotLine.startIndex)
      idx += 1
    }, 250)

    setTimeout(() => {
      console.log("slotsStopped()")
      this.emit("slotsStopped")
      this.slotsRollSound.stop()
    }, 3300)
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
      strength: 20
    }, 0)
    tl.to(this.bgColor, {
      alpha: 0.65,
      duration: 1.2
    }, 0.2)
    await tl
    console.log("spinner end")
  }
}
