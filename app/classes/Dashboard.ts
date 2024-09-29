/**
 * This will be the actual data structure of the dashboard that does the hard work.
 * It will be responsible for managing the data and the graphs.
 */
export default class Dashboard {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Export dashboard to .pjpms file
   */
  public export() {}

  public getName(): string {
    return this.name;
  }
}

export function importDashboard(filePath: string): Dashboard {
  // TODO INCORPORATE FILE READING
  console.log(filePath);
  return new Dashboard('hello world');
}
