import { Container, Sprite, Texture } from "pixi.js";
import Loadbar from "./loadbar";
import Config from "./config"
import { gsap } from "gsap/gsap-core"


export default class Game extends Container {
  app
  assets

  constructor(props) {
    super()

    this.app = props.app
    this.assets = props.assets

    this.loadingScene = this.createLoadingScene()
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

    // LOGO
    let logo = new Sprite(this.assets.logo)
    logo.anchor.set(0.5)
    logo.scale.set(0.9)
    logo.position.x = Config.width / 2
    logo.position.y = 150
    container.addChild(logo)

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
