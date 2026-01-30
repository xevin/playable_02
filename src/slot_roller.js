import { BlurFilter, Container, Sprite } from "pixi.js"
import { gsap } from "gsap/gsap-core"
import { getCyclicElement, rotateArray } from "./utils"

export default class SlotRoller extends Container {
  currentIndex
  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets
    this.startIndex = props.startIndex
    this.currentIndex = this.startIndex
    this.items = []

    this.container = new Container()
    this.container.label = "SlotRoller"
    this.addChild(this.container)

    this.drawItems()
  }

  rollTo(index) {
    // прокручиваем до <index> картинки

    let tl = gsap.timeline()
    let tl_offset = 0
    this.currentIndex = index
    tl.to(this, {
      y: 250,
      duration: 2,
      stagger: {
        onComplete: () => {
          this.currentIndex = index
          this.emit("finished")
//          this.drawItems()
        }
      }
    }, tl_offset)
  }

  drawItems() {
    this.position.y = 0
    this.items.forEach(item => {
      item.destroy()
    })

    this.items = []
    let itemList = rotateArray([1,2,3,4,5,6,7], this.currentIndex)

    let hOffset = 128 + 28
    let lastYPos = 0
//    console.log("drawItems from", this.currentIndex, itemList)
    for(let i=0; i<32; i++) {
//      let itemIdx = itemList[i]
      if (i == 1) {
        continue
      }

      let itemIdx = getCyclicElement(itemList, i)
      let slotSprite = new Sprite(this.assets["slot" + itemIdx])
      slotSprite.label = "slot" + i
      slotSprite.position.y = i * hOffset
      lastYPos = i * hOffset
      this.items.push(slotSprite)
      this.container.addChild(slotSprite)
    }

    this.position.y = -lastYPos + hOffset * 4.5
  }
}
