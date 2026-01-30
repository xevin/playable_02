import { Application, Assets } from "pixi.js";
import AssetLib from "./assets.js"
import Game from "./game";
import Config from "./config"
import { initDevtools } from "@pixi/devtools";

const initApp = async () => {
  const app = new Application();
  const gameWrapper = document.getElementById("app")
  await app.init({
    resizeTo: window,
    background: Config.loadingBgColor,
    height: Config.height
  });
  gameWrapper.appendChild(app.canvas)

  initDevtools({app})

  // --- Ассеты
  const assets = await Assets.loadBundle("main");

  // --- добавляем всякое для отрисовки
  const game = new Game({app, assets})
  app.stage.addChild(game)

  // ---
  function resize() {
    const originalHeight = Config.height
    const originalWidth = Config.width

    let width = gameWrapper.offsetWidth;
    let height = gameWrapper.offsetHeight;

    let screenScaleH = height / originalHeight
    let screenScaleW = width / originalWidth
    let screenScale = screenScaleH

    if (height > width) {
      screenScale = screenScaleW
      console.log("portrait")
    } else {
      console.log("landscape")
    }

    app.stage.scale.set(screenScale)
    app.renderer.resize(width, height)
    app.stage.position.x = (width - Config.width * screenScale) / 2
    app.stage.position.y = (height - Config.height * screenScale) / 2
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
