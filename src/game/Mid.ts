import LoaderResource = PIXI.LoaderResource;

export class Mid extends PIXI.TilingSprite{
  resources: Partial<Record<string, LoaderResource>>;
  viewportX = 0;
  DELTA_X = 0.32;

  setViewportX(viewportX: number) {
    const distanceTravelled = viewportX - this.viewportX;
    this.viewportX = viewportX;
    this.tilePosition.x -= distanceTravelled * this.DELTA_X;
    this.position.y = 128;
  }

  constructor(resources, width?: number, height?: number) {
    super(resources.mid.texture, width, height);
    this.tilePosition.set(0, 0);
    this.position.set(0, 0);
  }

}
