import { BlurFilter, Container, Sprite } from "pixi.js"
import Loadbar from "./loadbar"
import Config from "./config"
import SlotsScene from "./slots_scene"
import Gui from "./gui";
import { gsap } from "gsap/gsap-core"
import WinScene from "./win_scene"
import SpinnerScene from "./spinner_scene"

const SLOTS_STATE = 2
const SPINNER_STATE = 3
const WIN_STATE = 4

export default class Game extends Container {
  app
  assets
  state

  constructor(props) {
    super()

    this.app = props.app
    this.assets = props.assets

    // DEBUG
   this.state = SLOTS_STATE
//    this.state = SPINNER_STATE
//    this.state = WIN_STATE

    this.slotsScene = new SlotsScene({app: this.app, assets: this.assets, data: this.data})
    this.addChild(this.slotsScene)

    let balance = 0
    let gotoSpinner = false
    this.gui = new Gui({...props})
    this.gui.setBalance(balance)

    this.slotsScene.on("slotsStopped", async () => {
      await this.gui.animateBalanceTo(balance)

      // переключение сцены на спиннер
      if (gotoSpinner) {
        this.slotsScene.fadeUnload()
        this.spinnerScene.show()
      } else {
        this.gui.setSpinButtonLocked(false)
      }
    })

    // Обработка кликов
    let clickCount = 0

    this.gui.on("spinpressed", () => {
      if (this.gui.isSpinButtonLocked) {
        console.log("button is locked")
        return
      }

      clickCount += 1
      console.log("click", clickCount)
      this.gui.setSpinButtonLocked(true)

      if (!gotoSpinner) {
        this.slotsScene.runSlots()
      }

      if (this.state === SLOTS_STATE) {
        console.log("крутим слоты")
      } else if (this.state === SPINNER_STATE) {
        console.log("крутим спиннер")
        this.spinnerScene.spinWheel()
      }

      switch (clickCount) {
        case 1:
          balance = 200
          break;
        case 2:
          balance += 0
          break;
        case 3:
          balance = 700
          break;
        case 4:
          balance += 0
          break;
        case 5:
          gotoSpinner = true
          this.gui.setSpinButtonLocked(true)
          break;
        case 6:
          this.spinnerScene.spinWheel()
          this.gui.setSpinButtonLocked(true)
          break;
      }

      console.log("clicks now", clickCount)
    })

    this.spinnerScene = new SpinnerScene({...props})
    this.spinnerScene.on("spinnerDone", () => {
      balance = balance * 66
      this.gui.animateBalanceTo(balance, 2)
      this.winScene.show()
      setTimeout(() => {
        this.gui.hide()
      }, 200)
    })
    this.spinnerScene.on("afterShow", () => {
      this.gui.setSpinButtonLocked(false)
    })

    this.addChild(this.spinnerScene)
    this.addChild(this.gui)

    this.winScene = new WinScene({...props})
    this.addChild(this.winScene)

    this.slotsScene.visible = this.state === SLOTS_STATE || this.state === LOADING_STATE
    this.spinnerScene.visible = this.state === SPINNER_STATE
    this.winScene.visible = this.state === WIN_STATE

    // kostyl for debug
    if (this.state === SPINNER_STATE) {
      console.log("показываем спиннер")
      this.spinnerScene.show()
    }
  }

  resize(data) {
    this.scale.set(data.scale)
    this.position.x = (data.width - Config.width * data.scale) / 2
    this.position.y = (data.height - Config.height * data.scale) / 2
    this.slotsScene.resize(data)
  }
}
