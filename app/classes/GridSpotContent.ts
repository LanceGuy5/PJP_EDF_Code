import { ECBasicOption } from 'echarts/types/dist/shared';
import { XAxisData } from '../types/ChartOptions';

export default class GridSpotContent {
  private name: string;
  private content: ECBasicOption;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private port: string;
  private id: string;
  private data: [XAxisData, number];

  constructor(
    name: string,
    content: ECBasicOption,
    x: number,
    y: number,
    width: number,
    height: number,
    port: string,
    id: string,
    data: [XAxisData, number]
  ) {
    this.name = name;
    this.content = content;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.port = port;
    this.id = id;
    this.data = data;
  }

  getName(): string {
    return this.name;
  }

  getOptions(): ECBasicOption {
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

  getPortInfo(): string {
    return this.port;
  }

  getPortPath(): string {
    const x = this.port.split(',')[0];
    return x.substring(x.indexOf(':') + 1).trim();
  }

  getPNPId(): string {
    const x = this.port.split(',')[1];
    return x.substring(x.indexOf(':') + 1).trim();
  }

  getManufacturer(): string {
    const x = this.port.split(',')[2];
    return x.substring(x.indexOf(':') + 1).trim();
  }

  getId(): string {
    return this.id;
  }

  getData(): [XAxisData, number] {
    return this.data;
  }

  setName(name: string): void {
    this.name = name;
  }

  setOptions(content: ECBasicOption): void {
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

  setPort(port: string): void {
    this.port = port;
  }
}
