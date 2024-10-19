import GridSpotContent from './GridSpotContent';

/**
 * This will be the actual data structure of the dashboard that does the hard work.
 * It will be responsible for managing the data and the graphs.
 */
export default class Dashboard {
  private name: string;
  private content: (GridSpotContent | null)[][];

  constructor(name: string, content: GridSpotContent[][]) {
    this.name = name;
    this.content = content;
  }

  /**
   * Export dashboard to .pjpms file
   */
  public export() {}

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setContent(content: GridSpotContent, i: number, j: number): boolean {
    try {
      this.content[i][j] = content;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public getContent(i: number, j: number): GridSpotContent | null {
    return this.content[i][j];
  }

  public getContents(): (GridSpotContent | null)[][] {
    return this.content;
  }

  public removeContent(i: number, j: number): boolean {
    try {
      this.content[i][j] = null;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

export function importDashboard(filePath: string): Dashboard {
  // TODO INCORPORATE FILE READING
  console.log(filePath);
  return new Dashboard('hello world', []);
}
