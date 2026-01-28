import { Container, Sprite, Text, BlurFilter, ColorMatrixFilter, Graphics } from "pixi.js";
import Loadbar from "./loadbar";
import Config from "./config"
import SlotsScene from "./slots_scene";
import Gui from "./gui";
import { gsap } from "gsap/gsap-core"

export default class Game extends Container {
  app
  assets

  constructor(props) {
    super()

    this.app = props.app
    this.assets = props.assets

    this.slotsScene = new SlotsScene({app: this.app, assets: this.assets})
    this.addChild(this.slotsScene)

    let balance = 0
    this.gui = new Gui({...props})
    this.gui.on("spinpressed", () => {
      balance += 100
      if (balance <= 300) {
        this.gui.animateBalanceTo(balance)
        return
      }

      this.slotsScene.fadeUnload()
    })

    this.loadingScene = this.createLoadingScene()

    this.addChild(this.gui)
    this.addChild(this.loadingScene)
    this.startLoading()
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
