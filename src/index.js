import { Application, Assets } from "pixi.js";
import * as AssetLib from "./assets.js"
import Game from "./game";

const initApp = async () => {
  const app = new Application();
  const gameWrapper = document.getElementById("app")
  await app.init({
    background: "#233040",
    resizeTo: window,
    height: 1080
  });
  gameWrapper.appendChild(app.canvas)

  // --- Ассеты
  const assets = await Assets.loadBundle("main");

  // --- добавляем всякое для отрисовки
  const game = new Game({app, assets})
  app.stage.addChild(game)

  // ---
  function resize() {
    let scale = app.screen.height / 1080
    app.stage.scale.set(scale)
    app.stage.position.y = 0
  }

  // Масштабирование канваса под размер экрана
  window.addEventListener("resize", resize);
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
