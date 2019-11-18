import {DefaultScene} from "./default-scene";
import _ from "lodash"

require("pixi-projection");
// @ts-ignore
import anime from "animejs"
import LoaderResource = PIXI.LoaderResource;
// @ts-ignore
const projection = PIXI.projection;
// @ts-ignore
window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({PIXI: PIXI}) && window.__PIXI_INSPECTOR_GLOBAL_HOOK__;
const {Application, Loader, Sprite, Container} = PIXI;

export function setUp(canvasEl) {
  new Main(canvasEl);
}


class Main {
  app: PIXI.Application;
  scene: DefaultScene;
  scrollSpeed = 5;

  constructor(canvasEl) {
    this.app = new Application({
      width:512,
      height: 384,
      view: canvasEl,
      resolution: 1
    });
    new Loader().add([
      {name: "far", url: require("../assets/bg-far.png")},
      {name: "mid", url: require("../assets/bg-mid.png")},
      {name: "wall", url: "./static/wall.json"}])
      .load(this.setUpGame.bind(this));
  }

  setUpGame(__, resources: Partial<Record<string, LoaderResource>>) {
    this.scene = new DefaultScene(resources);
    this.app.stage.addChild(this.scene);
    this.app.ticker.add(this.update.bind(this));
  }

  update() {
    this.scene.moveViewportXBy(this.scrollSpeed);
  }
}
