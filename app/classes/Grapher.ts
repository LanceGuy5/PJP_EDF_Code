import { ECharts } from 'echarts';
import { DataPoint } from './DataPoint';
import { Queue } from './datastructures/Queue';

export class Grapher {
  private ref: React.MutableRefObject<ECharts | null>;
  private queue: Queue<DataPoint<number>>;

  constructor(ref: React.MutableRefObject<ECharts | null>) {
    this.ref = ref;
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
    if (!this.ref.current) {
      console.log('[ERROR] Chart not mounted');
      return { status: 'failure' };
    }
    if (this.queue.size() === 0) {
      console.log('[‼️] No data to display');
      return { status: 'success' };
    }
    return { status: 'success' };
  }
}
