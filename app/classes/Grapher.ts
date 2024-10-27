import { ECharts } from 'echarts';
import { DataPoint } from './DataPoint';
import { Queue } from './datastructures/Queue';
import { ERROR, LOG } from '../helpers/util';
// import { PortReader } from './PortReader';

export class Grapher {
  private ref: React.MutableRefObject<ECharts | null>;
  private queue: Queue<DataPoint<number>>;
  private isRunning: boolean;
  // private port: PortReader;

  constructor(ref: React.MutableRefObject<ECharts | null>) {
    this.ref = ref;
    this.queue = new Queue<DataPoint<number>>();
    this.isRunning = false;
    // this.port = new PortReader('COM6', {baudRate: 9600});
  }

  public receiveData(data: DataPoint<number>): {
    status: 'success' | 'failure';
  } {
    try {
      this.queue.enqueue(data);
    } catch (e) {
      ERROR(`Data receive: ${e}`);
      return { status: `failure` };
    }
    return { status: 'success' };
  }

  public start() {
    this.isRunning = true;
  }

  public stop() {
    this.isRunning = false;
  }

  // TODO NEEDS REWRITING
  public tick(): { status: 'success' | 'failure' } {
    if (!this.isRunning) {
      return { status: 'success' };
    }
    if (!this.ref.current) {
      ERROR('Chart not mounted');
      return { status: 'failure' };
    }
    if (this.queue.size() === 0) {
      LOG('[‼️] No data to display');
      return { status: 'success' };
    }
    const data = this.queue.dequeue();
    LOG(`[📈] Displaying data: ${data}`);
    this.ref.current.setOption({
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
        },
      ],
    });
    return { status: 'success' };
  }
}
