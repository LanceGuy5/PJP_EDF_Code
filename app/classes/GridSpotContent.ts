export default class GridSpotContent {
  private content: string | null;

  constructor(content: string | null) {
    this.content = content;
  }

  getContent(): string | null {
    return this.content;
  }

  setContent(content: string | null): void {
    this.content = content;
  }

  render(): string {
    return this.content || '';
  }
}
