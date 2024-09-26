export class DataPoint<T> {
  private timestamp: number;
  private value: T;

  constructor(value: T, timestamp: number) {
    this.value = value;
    this.timestamp = timestamp;
  }

  public getValue(): T {
    return this.value;
  }

  public getTimestamp(): number {
    return this.timestamp;
  }
}
