import { Container, Sprite } from "pixi.js"
import { rotateArray } from "./utils"
import { gsap } from "gsap/gsap-core"

export default class SlotLine extends Container {
  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets
    this.usedItems = props.usedItems
    this.items = []

    let container = new Container()
    let itemList = rotateArray(this.usedItems, this.currentIndex)

    // let hOffset = 128 + 28
    let hOffset = 128 + 28

//    console.log("drawItems from", this.currentIndex, itemList)
    for(let i=1; i<8; i++) {
      let itemIdx = itemList[i]
      let slotSprite = new Sprite(this.assets["slot" + itemIdx])
      slotSprite.label = "slot" + i
      slotSprite.anchor.set(0.5)
      slotSprite.position.y = i * hOffset + 50
      slotSprite.position.x = 64
      this.items.push(slotSprite)
      container.addChild(slotSprite)
    }

    this.addChild(container)
  }

  runJeffZoom() {
    let i = 0
    let tl = gsap.timeline()
    this.items.forEach(item => {
      tl.to(item.scale, {
        x: 1.5,
        y: 1.5,
        duration: 0.3,
        yoyo: true,
        repeat: 1
      }, 0)
      //
      // tl.to(item.scale, {
      //   x: 1,
      //   y: 1,
      //   duration: 0.15
      // }, i * 0.5)
      // i += 1
    })
  }
}
