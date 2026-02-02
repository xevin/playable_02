import { Application, Assets, Sprite } from "pixi.js";
// import AssetLib from "./assets.js"
import Game from "./game";
import Config from "./config"
// import { initDevtools } from "@pixi/devtools";
import LoadingScene from "./loading_scene";

const initApp = async () => {
  const app = new Application();
  const gameWrapper = document.getElementById("app")
  await app.init({
    resizeTo: window,
    background: Config.loadingBgColor,
    height: Config.height
  });
  gameWrapper.appendChild(app.canvas)

  // initDevtools({app})

  // --- Ассеты
  const assets = await Assets.loadBundle("main");

  // --- добавляем всякое для отрисовки
  var appData = {
    isPortrait: false
  }
  const game = new Game({app, assets})
  app.stage.addChild(game)

  const loader = new LoadingScene({app, assets})
  app.stage.addChild(loader)
  loader.animateLoader()

  // ---
  function resize() {
    let width = gameWrapper.offsetWidth
    let height = gameWrapper.offsetHeight

    let screenScaleH = height / Config.height
    let screenScaleW = width / Config.minWidth
    let screenScale = screenScaleH

    appData.isPortrait = false
    if (height > width) {
      screenScale = screenScaleW
      appData.isPortrait = true
      console.log("portrait")
    } else {
      console.log("landscape")
    }

    appData.scale = screenScale
    appData.width = width
    appData.height = height

    app.renderer.resize(width, height)

    // вместо скейла stage, скейлим game
    // app.stage.scale.set(screenScale)
    // вместо этого, центрируется game
    // app.stage.position.x = (width - Config.width * screenScale) / 2
    // app.stage.position.y = (height - Config.height * screenScale) / 2
    game.resize(appData)

    // LoadScene масштабирование
    const scaleX = app.screen.width / Config.width
    const scaleY = app.screen.height / Config.height

    loader.resize({
      // Берем больший масштаб
      scale: Math.max(scaleY, scaleX),
      isPortrait: appData.isPortrait,
      x: width / 2,
      y: height / 2,
      screenScale: screenScale,
    })
  }

  // Масштабирование холста под размер экрана
  window.addEventListener("resize", resize);
  window.addEventListener("deviceorientation", resize);
  resize()
};


document.addEventListener('DOMContentLoaded', () => {
  if (typeof sdk !== 'undefined' && sdk && sdk.init) {
    try {
      sdk.init(() => {
        sdk.start();
      });

      sdk.on('resize', () => {});

      sdk.on('finish', () => {});
    } catch (error) {
      console.error('Ошибка инициализации SDK:', error);
    }
  }

  initApp();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {}, 1);
}
