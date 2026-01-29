import { Container, Sprite } from "pixi.js"
import { gsap } from "gsap/gsap-core"

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
    this.container.label = "SlotLine"
    this.addChild(this.container)

    this.drawItems()
  }

  rollTo(index) {
    // прокручиваем до <index> картинки

    let tl = gsap.timeline()
    let tl_offset = 0
    tl.to(this, {
      y: 128 * 18,
      duration: 2,
      stagger: {
        onComplete: () => {
          this.currentIndex = index
          this.drawItems()
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
    let itemList = this.rotateArray([1,2,3,4,5,6,7], this.currentIndex)

    console.log("drawItems from", this.currentIndex, itemList)
    for(let i=1; i<8; i++) {
      let itemIdx = itemList[i]
      let slotSprite = new Sprite(this.assets["slot" + itemIdx])
      slotSprite.label = "slot" + i
      slotSprite.position.y = i * 128
      this.items.push(slotSprite)
      this.container.addChild(slotSprite)
    }

    for(let i=1; i<8; i++) {
      let itemIdx = itemList[i]
      let slotSprite = new Sprite(this.assets["slot" + itemIdx])
      slotSprite.label = "slot" + i
      slotSprite.position.y = i * 128 - 128 * 6
      this.items.push(slotSprite)
      this.container.addChild(slotSprite)
    }

    for(let i=1; i<8; i++) {
      let itemIdx = itemList[i]
      let slotSprite = new Sprite(this.assets["slot" + itemIdx])
      slotSprite.label = "slot" + i
      slotSprite.position.y = i * 128 - 128 * 6 - 128 * 6
      this.items.push(slotSprite)
      this.container.addChild(slotSprite)
    }

    for(let i=1; i<8; i++) {
      let itemIdx = itemList[i]
      let slotSprite = new Sprite(this.assets["slot" + itemIdx])
      slotSprite.label = "slot" + i
      slotSprite.position.y = i * 128 - 128 * 6 - 128 * 6 - 128 * 6
      this.items.push(slotSprite)
      this.container.addChild(slotSprite)
    }
  }

  rotateArray(arr, startIndex) {
    if (!Array.isArray(arr) || arr.length === 0) return [];

    const index = ((startIndex % arr.length) + arr.length) % arr.length;
    return [...arr.slice(index), ...arr.slice(0, index)];
  }
}
