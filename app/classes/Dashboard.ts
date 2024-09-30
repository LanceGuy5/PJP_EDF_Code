import GridSpotContent from './GridSpotContent';

/**
 * This will be the actual data structure of the dashboard that does the hard work.
 * It will be responsible for managing the data and the graphs.
 */
export default class Dashboard {
  private name: string;
  private content: GridSpotContent[][];

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
}

export function importDashboard(filePath: string): Dashboard {
  // TODO INCORPORATE FILE READING
  console.log(filePath);
  return new Dashboard('hello world', []);
}
