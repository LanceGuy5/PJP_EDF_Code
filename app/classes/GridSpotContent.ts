import { ECharts } from 'echarts';
import { Options } from 'electron';

export default class GridSpotContent {
  private content: Options;
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(
    content: Options,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.content = content;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getContent(): Options {
    return this.content;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  setContent(content: Options): void {
    this.content = content;
  }

  setX(x: number): void {
    this.x = x;
  }

  setY(y: number): void {
    this.y = y;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }
}
