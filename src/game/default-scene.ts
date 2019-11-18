import LoaderResource = PIXI.LoaderResource;
import TilingSprite = PIXI.TilingSprite;
import _ from "lodash";
import {Far} from "./Far";
import {Mid} from "./Mid";
import {Walls} from "./Walls";
import MapBuilder from "./MapBuilder"

export class DefaultScene extends PIXI.Container {
  resources: Partial<Record<string, LoaderResource>>;
  viewportX = 0;
  far: Far;
  mid: Mid;
  front: Walls;

  constructor(resources) {
    super();
    this.resources = resources;
    this.far = new Far(resources,512,256);
    this.mid = new Mid(resources,512,256);
    this.front = new Walls(resources);
    new MapBuilder(this.front);
    this.addChild(this.far);
    this.addChild(this.mid);
    this.addChild(this.front);
  }


  moveViewportXBy(scrollSpeed: number) {
    const viewportX = this.viewportX + scrollSpeed;
    this.viewportX = viewportX;
    this.far.setViewportX(viewportX);
    this.mid.setViewportX(viewportX);
    this.front.setViewportX(viewportX);
  }
}
