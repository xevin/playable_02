import { BlurFilter, Container, Sprite } from "pixi.js"
import Loadbar from "./loadbar"
import Config from "./config"
import SlotsScene from "./slots_scene"
import Gui from "./gui";
import { gsap } from "gsap/gsap-core"
import WinScene from "./win_scene"
import SpinnerScene from "./spinner_scene"

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
    this.state = LOADING_STATE

    // DEBUG
//    this.state = SLOTS_STATE
//    this.state = SPINNER_STATE
//    this.state = WIN_STATE

    this.slotsScene = new SlotsScene({app: this.app, assets: this.assets})
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

    this.loadingScene = this.createLoadingScene()

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

    this.addChild(this.loadingScene)
    this.startLoading()

    this.winScene = new WinScene({...props})
    this.addChild(this.winScene)

    this.loadingScene.visible = this.state === LOADING_STATE
    this.slotsScene.visible = this.state === SLOTS_STATE || this.state === LOADING_STATE
    this.spinnerScene.visible = this.state === SPINNER_STATE
    this.winScene.visible = this.state === WIN_STATE

    // kostyl for debug
    if (this.state === SPINNER_STATE) {
      console.log("показываем спиннер")
      this.spinnerScene.show()
    }
  }

  createLoadingScene() {
    let container = new Container()


    this.loaderBackground = new Sprite(this.assets.loadingBackground)
    this.loaderBackground.filters = [new BlurFilter({strength: 30, quality: 8})]
    this.loaderBackground.anchor.set(0.5)
    let scale = this.app.screen.width / Config.width
    this.loaderBackground.scale.set(3)
    this.loaderBackground.position.x = Config.width / 2
    this.loaderBackground.position.y = Config.height / 2
    container.addChild(this.loaderBackground)

    let bg = new Sprite(this.assets.loadingBackground)
    bg.anchor.set(0.5)
//    bg.alpha = 0
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
    this.loader.position.x = Config.width / 2
    this.loader.position.y = (Config.height / 10) * 9

    container.addChild(this.loader)
    this.app.renderer.background.color = Config.bgColor
    return container
  }

  async startLoading() {
    await this.loader.animateLoaderProgress(30)
    await this.loader.animateLoaderProgress(100)

    await gsap.to(this.loadingScene, {
      x: -this.app.screen.width - (Config.width * 2),
      duration: 1,
      ease: "power3.inOut"
    }).eventCallback("onComplete", () => {
      this.removeChild(this.loadingScene)
    })
  }
}
