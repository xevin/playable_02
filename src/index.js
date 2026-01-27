import { Application } from "pixi.js";


const initApp = async () => {
  const app = new Application();
  const gameWrapper = document.getElementById("app")


  await app.init({
    background: "#1099bb",
    resizeTo: window,
    height: 960
  });


  gameWrapper.appendChild(app.canvas)


  function resize() {
    let scale = app.screen.height / 960
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
