import WallSpritesPool from "./WallSpritesPool";

class WallSlice {
  private type: any;
  private y: any;
  static WIDTH = 64;

  constructor(type, y) {
    this.type = type;
    this.y = y;
  }
}

const VIEWPORT_WIDTH = 512;
//计算出一屏需要多少块碎片
const VIEWPORT_NUM_SLICES = Math.ceil(VIEWPORT_WIDTH / WallSlice.WIDTH) + 1;

export enum SliceType {
  FRONT,
  BACK,
  STEP,
  DECORATION,
  WINDOW,
  GAP,
}

export class Walls extends PIXI.Container {
  pool = new WallSpritesPool();
  //碎片数组
  slices = [];
  //视口位置
  viewportX = 0;
  //碎片索引 第几个
  viewportSliceX = 0;
  borrowWallSpriteLookup: Function[];
  returnWallSpriteLookup: Function[];

  constructor(resources) {
    super();
    this.createLookupTables();
  }

  /**
   * 统一创建和回收
   */
  createLookupTables() {
    this.borrowWallSpriteLookup = [];
    this.borrowWallSpriteLookup[SliceType.FRONT] = this.pool.borrowFrontEdge;
    this.borrowWallSpriteLookup[SliceType.BACK] = this.pool.borrowBackEdge;
    this.borrowWallSpriteLookup[SliceType.STEP] = this.pool.borrowStep;
    this.borrowWallSpriteLookup[SliceType.DECORATION] = this.pool.borrowDecoration;
    this.borrowWallSpriteLookup[SliceType.WINDOW] = this.pool.borrowWindow;

    this.returnWallSpriteLookup = [];
    this.returnWallSpriteLookup[SliceType.FRONT] = this.pool.returnFrontEdge;
    this.returnWallSpriteLookup[SliceType.BACK] = this.pool.returnBackEdge;
    this.returnWallSpriteLookup[SliceType.STEP] = this.pool.returnStep;
    this.returnWallSpriteLookup[SliceType.DECORATION] = this.pool.returnDecoration;
    this.returnWallSpriteLookup[SliceType.WINDOW] = this.pool.returnWindow;
  };

  checkViewportXBounds(viewportX) {
    //计算出视口最大距离
    const maxViewportX = (this.slices.length - VIEWPORT_NUM_SLICES) * WallSlice.WIDTH;
    if (viewportX < 0) viewportX = 0;
    else if (viewportX > maxViewportX) viewportX = maxViewportX;
    return viewportX;
  };

  /**
   * 移动视口
   * 创建和移除碎片
   */
  setViewportX(viewportX: number) {
    this.viewportX = this.checkViewportXBounds(viewportX);
    const prevViewportSliceX = this.viewportSliceX;
    this.viewportSliceX = Math.floor(this.viewportX / WallSlice.WIDTH);
    this.removeOldSlices(prevViewportSliceX);
    this.addNewSlices();
  }

  /***
   * 移除超过距离的碎片
   * 当前的索引减去之前的索引 = 需要被移除的个数
   */
  private removeOldSlices(prevViewportSliceX: number) {
    let numOldSlices = this.viewportSliceX - prevViewportSliceX;
    if (numOldSlices > VIEWPORT_NUM_SLICES) numOldSlices = VIEWPORT_NUM_SLICES;
    //紧接着之前已经退掉的索引继续退还
    for (let i = prevViewportSliceX; i < prevViewportSliceX + numOldSlices; i++) {
      const slice = this.slices[i];
      if (slice.sprite != null) {
        this.returnWallSprite(slice.type, slice.sprite);
        this.removeChild(slice.sprite);
        slice.sprite = null;
      }
    }
  }

  /**
   * 从当前索引一直遍历到 当前索引+屏幕最大容量个数  也就是遍历一屏
   * 如果有哪个索引没精灵 则添加
   * 如果哪个索引有精灵 则移动它的x（向左平移）
   */
  private addNewSlices() {
    let firstX = -(this.viewportX % WallSlice.WIDTH);
    //
    for (let i = this.viewportSliceX, sliceIndex = 0; i < this.viewportSliceX + VIEWPORT_NUM_SLICES; i++, sliceIndex++) {
      let slice = this.slices[i];
      if (slice.sprite == null && slice.type != SliceType.GAP)
      {
        slice.sprite = this.borrowWallSprite(slice.type);
        slice.sprite.position.x = firstX + (sliceIndex * WallSlice.WIDTH);
        slice.sprite.position.y = slice.y;
        this.addChild(slice.sprite);
      }
      else if (slice.sprite != null)
      {
        slice.sprite.position.x = firstX + (sliceIndex * WallSlice.WIDTH);
      }
    }
  }
  addSlice(sliceType, y) {
    this.slices.push(new WallSlice(sliceType, y));
  };
  private returnWallSprite(type: SliceType, sprite: any) {
    this.returnWallSpriteLookup[type].call(this.pool, sprite);
  }

  private borrowWallSprite(type: SliceType) {
    return this.borrowWallSpriteLookup[type].call(this.pool);

  }
}
