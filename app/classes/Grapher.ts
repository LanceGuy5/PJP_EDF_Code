import { DataPoint } from './DataPoint';
import { Queue } from './datastructures/Queue';

export class Grapher {
  private queue: Queue<DataPoint<number>>;

  constructor() {
    this.queue = new Queue<DataPoint<number>>();
  }

  public recieveData(data: DataPoint<number>): {
    status: 'success' | 'failure';
  } {
    try {
      this.queue.enqueue(data);
    } catch (e) {
      console.log(`[ERROR] Data recieve: ${e}`);
      return { status: `failure` };
    }
    return { status: 'success' };
  }

  public tick(): { status: 'success' | 'failure' } {
    return { status: 'success' };
  }
}
