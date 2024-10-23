import { ECharts } from 'echarts';

export default class GridSpotContent {
  private content: ECharts | null;
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(
    content: ECharts | null,
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

  getContent(): ECharts | null {
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

  setContent(content: ECharts | null): void {
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
