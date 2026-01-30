import { Container, Graphics, Sprite, BlurFilter, Text } from "pixi.js";
import { gsap } from "gsap/gsap-core"
import Config from "./config"
import { sounds } from "./assets"
import SlotRoller from "./slot_roller";
import SlotLine from "./slot_line";
import BoxAnimation from "./box_animation";

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
    this.casualWinSound = new Howl({
      src: [
        sounds.slotCasualWin
      ],
      html5: true,
    })

    let slotLineContainer = new Container()
    this.slotLineContainer = slotLineContainer
    slotLineContainer.label = "SlotLineContainer"
    slotLineContainer.position.x = 635
    slotLineContainer.position.y = 0

    let slotMask = new Graphics()
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

    this.jeffCols = this.jeffColumns()
    this.jeffCols.position.y = -840
    slotLineContainer.addChild(this.jeffCols)

    this.tryCount = 0
  }

  createGameScene() {
    // Общий контейнер
    let container = new Container()

    // контейнер со слотами, лого и фоном
    this.gameContainer = new Container()
    this.gameContainer.label = "gameContainer"
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

  async runSlots5() { // он же Джеф рол
    this.resetSlotLines()

    let tl = gsap.timeline()

    for(let i=0; i<4; i++) {
      tl.to(this.slotLines[i], {
        y: -60,
        duration: 2,
      }, i * 0.25)

      tl.to(this.slotLines[i], {
        alpha: 0,
        duration: 0.5,
      }, i * 0.25 + 1)
    }

    let z = {value: 0}
    tl.to(z, {
      value: 1,
      stagger: {
        onComplete: () => {
          this.jeffRoll()
        }
      }
    }, 0.6)

    await tl
    this.emit("slotsStopped")
    this.slotsRollSound.stop()
  }

  runSlots() { // основной метод запуска слотов
    if (this.tryCount === 0) {
      this.slotsRollSound.play()
      this.runSlots1()
    }
    if (this.tryCount === 1) {
      this.slotsRollSound.play()
      this.runSlots2()
    }
    if (this.tryCount === 2) {
      this.slotsRollSound.play()
      this.runSlots2()
    }
    if (this.tryCount === 3) {
      this.slotsRollSound.play()
      this.runSlots2()
    }
    if (this.tryCount === 4) {
      this.slotsRollSound.play()
      this.runSlots5()
    }

    this.tryCount += 1
  }

  async runSlots1() { // первый рол с ящиками
    let idx = 0
    let it = setInterval(() => {
      if (idx >= 4) {
        clearInterval(it)
        return
      }
      console.log("idx", idx)
      let slotLine = this.slotLines[idx]
      slotLine.rollTo(8) //slotLine.startIndex)
      if (idx === 3) {
        slotLine.on("finished", () => {
          console.log("finished")
        })
      }
      idx += 1
    }, 250)

    setTimeout(() => {
      this.boxRoll()
      setTimeout(() => {
        console.log("slotsStopped()")
        this.casualWinSound.play()
        setTimeout(() => {
          this.emit("slotsStopped")
          this.slotsRollSound.stop()
        }, 250)
      }, 1800)
    }, 1700)
  }

  async runSlots2() {
    this.resetSlotLines()

    let tl = gsap.timeline()

    for(let i=0; i<4; i++) {
      tl.to(this.boxes[i], {
        y: 825,
      }, i * 0.25)

      tl.to(this.slotLines[i], {
        y: -60,
        duration: 2,
      }, i * 0.25)
    }

    await tl
    this.emit("slotsStopped")
    this.slotsRollSound.stop()
  }

  resetSlotLines() {
    this.slotLines.forEach(slot => {
      slot.position.y = -4120
    })
  }

  jeffColumns() {
    let container = new Container()
    let jeffColumns = []
    for(let i=0; i<4; i++) {
      let jCol = new SlotLine({assets: this.assets, usedItems: [1, 1, 1, 1, 1, 1, 1]})
      jeffColumns.push(jCol)
      jCol.position.x = i * 175
      container.addChild(jCol)
    }

    return container
  }

  jeffRoll() {
    gsap.to(this.jeffCols, {
      y: -220
    })
  }

  boxColumns() {
    let container = new Container()
    let boxColumns = []
    for(let i=0; i<4; i++) {
      let bCol = new BoxAnimation({assets: this.assets})
      boxColumns.push(bCol)
      bCol.position.x = i * 175
      container.addChild(bCol)
    }
    this.slotLineContainer.addChild(container)
    container.position.y = 100
    container.position.x = 0

    return boxColumns
  }

  async boxRoll() {
    this.boxes = this.boxColumns()

    let tl = gsap.timeline()

    for(let i=0; i<4; i++) {
      tl.to(this.boxes[i], {
        y: 325
      }, i * 0.25)
    }

    tl.eventCallback("onComplete", () => {
      this.boxes.forEach(box => box.playBoxAnimation())
    })

    await tl
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
