import { Container, BlurFilter, Sprite } from "pixi.js";
import Config from "./config";
import { gsap } from "gsap/gsap-core"
import Loadbar from "./loadbar";


export default class LoadingScene extends Container {
  constructor(props) {
    super()

    this.app = props.app
    this.assets = props.assets

    this.bgContainer = new Container()
    this.addChild(this.bgContainer)
    this.loaderBackground = new Sprite(this.assets.loadingBackground)
    this.loaderBackground.anchor.set(0.5)
    this.loaderBackground.addChild(this.loaderBackground)
    this.bgContainer.addChild(this.loaderBackground)

    // LOADER
    this.loader = new Loadbar({
      bg: this.assets.loaderBg,
      fg: this.assets.loaderFg,
      progress: this.assets.loaderProgress,
      progressMask: this.assets.loaderProgressMask,
    })
    this.loader.scale.set(0.9)

    this.content = new Container()
    this.addChild(this.content)
    this.content.addChild(this.loader)
    this.app.renderer.background.color = Config.bgColor
  }

  async animateLoader() {
    await this.loader.animateLoaderProgress(30)
    await this.loader.animateLoaderProgress(100)

    await gsap.to(this, {
      x: -this.app.screen.width - (Config.width * 2),
      duration: 1,
      ease: "power3.inOut"
    }).eventCallback("onComplete", () => {
      this.emit("loadingDone")
    })
  }

  resize(data) {
    this.content.scale.set(data.screenScale)
    this.content.position.x = data.x
    this.content.position.y = data.y + data.y / 1.25

    this.bgContainer.position.x = data.x
    this.bgContainer.position.y = data.y
    this.bgContainer.scale.set(data.scale)

    if (!data.isPortrait) {
      let w = this.app.screen.width / 16
      let h = this.app.screen.height / w

      // на узких экранах, с соотношением меньше 16:8
      // Отодвигаем вниз, что-бы было видно логотип на экране загрузки
      if (h < 8) {
        this.bgContainer.y += 30
      }
    }
  }
}
