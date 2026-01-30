import { Container, Sprite } from "pixi.js"
import { rotateArray } from "./utils"

export default class SlotLine extends Container {
  constructor(props) {
    super()
    this.app = props.app
    this.assets = props.assets
    this.usedItems = props.usedItems
    this.items = []

    let container = new Container()
    let itemList = rotateArray(this.usedItems, this.currentIndex)

    let hOffset = 128 + 28

//    console.log("drawItems from", this.currentIndex, itemList)
    for(let i=1; i<8; i++) {
      let itemIdx = itemList[i]
      let slotSprite = new Sprite(this.assets["slot" + itemIdx])
      slotSprite.label = "slot" + i
      slotSprite.position.y = i * hOffset
      this.items.push(slotSprite)
      container.addChild(slotSprite)
    }

    this.addChild(container)
  }
}
