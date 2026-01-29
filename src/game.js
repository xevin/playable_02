import { Container, Sprite } from "pixi.js"
import Loadbar from "./loadbar"
import Config from "./config"
import Spinner from "./spinner"
import SlotsScene from "./slots_scene"
import Gui from "./gui";
import { gsap } from "gsap/gsap-core"
import WinScene from "./win_scene"

const LOADING_STATE = 1
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
//    this.state = LOADING_STATE
//    this.state = SLOTS_STATE
    this.state = SPINNER_STATE

    this.slotsScene = new SlotsScene({app: this.app, assets: this.assets})
    this.addChild(this.slotsScene)

    let balance = 10
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
        this.gui.isSpinButtonLocked = false
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
      this.gui.isSpinButtonLocked = true

      if (!gotoSpinner) {
        this.slotsScene.runSlots()
      }
      if (this.state === SLOTS_STATE) {
        console.log("крутим слоты")
      } else if (this.state === SPINNER_STATE) {
        console.log("крутим спиннер")
        this.spinnerScene.spinWheel()
      }

//      switch (clickCount) {
//        case 1:
//          balance = 200
//          break;
//        case 2:
//          balance += 7
//          break;
//        case 3:
//          balance = 700
//          break;
//        case 4:
//          balance += 7
//          break;
//        case 5:
//          gotoSpinner = true
//          this.gui.isSpinButtonLocked = true
//          break;
//        case 6:
//          this.spinnerScene.spinWheel()
//          this.gui.isSpinButtonLocked = true
//          break;
//      }

      console.log("clicks now", clickCount)
    })

    this.loadingScene = this.createLoadingScene()

    this.spinnerScene = new Spinner({...props})
    this.spinnerScene.on("spinnerDone", () => {
      balance = balance * 66
      this.gui.animateBalanceTo(balance, 2)
      this.winScene.show()
      this.gui.hide()
    })
    this.spinnerScene.on("afterShow", () => {
      this.gui.isSpinButtonLocked = false
    })

    this.addChild(this.spinnerScene)
    this.addChild(this.gui)

    this.addChild(this.loadingScene)
    this.startLoading()

    this.winScene = new WinScene({...props})
    this.addChild(this.winScene)

    this.loadingScene.visible = this.state === LOADING_STATE
    this.slotsScene.visible = this.state === SLOTS_STATE
    this.spinnerScene.visible = this.state === SPINNER_STATE
    this.winScene.visible = this.state === WIN_STATE

    if (this.state === SPINNER_STATE) {
      console.log("показываем спиннер")
      this.spinnerScene.show()
    }
  }

  createLoadingScene() {
    let container = new Container()

    let bg = new Sprite(this.assets.loadingBackground)
    bg.anchor.set(0.5)
    bg.position.x = Config.width / 2
    bg.position.y = Config.height / 2
    container.addChild(bg)

    // LOADER
    this.loader = new Loadbar({
      bg: this.assets.loaderBg,
      fg: this.assets.loaderFg,
      progress: this.assets.loaderProgress,
      progressMask: this.assets.loaderProgressMask,
    })
    this.loader.scale.set(0.9)
    this.loader.position.x = 1920 / 2
    this.loader.position.y = (1080 / 10) * 9

    container.addChild(this.loader)

    return container
  }

  async startLoading() {
    await this.loader.animateLoaderProgress(30)
    await this.loader.animateLoaderProgress(100)

    await gsap.to(this.loadingScene, {
      x: -Config.width,
      duration: 1,
      ease: "power2.inOut"
    }).eventCallback("onComplete", () => {
      this.removeChild(this.loadingScene)
    })
  }
}
