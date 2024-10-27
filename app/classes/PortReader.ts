import { EventEmitter } from 'events';
import { SerialPort } from 'serialport';
import { LOG } from '../helpers/util';

export class PortReader extends EventEmitter {
  private serialPort: SerialPort;

  constructor(serialPort: string, params: { baudRate?: number }) {
    super();
    this.serialPort = new SerialPort(
      serialPort
      // {
      //   baudRate: params.baudRate || 9600,
      // }
    );
    this.serialPort.open((err) => {
      if (err) {
        return console.error('Error opening the port:', err.message);
      }
      LOG(
        `Serial port opened at ${serialPort} with baud rate ${params.baudRate}`
      );
    });
  }

  public readPort = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (window as any).electronAPI.readPort(
        this.serialPort
      );
      LOG(result); // handle result here
    } else {
      LOG('Electron API not available in this environment');
    }
  };

  public closePort(): { message: 'success' | 'failure' } {
    this.serialPort.close((err) => {
      if (err) {
        console.error('Error closing port:', err);
        return { message: 'failure' };
      } else {
        LOG('Port closed.');
        return { message: 'success' };
      }
    });
    return { message: 'failure' };
  }

  public getSerialPort(): SerialPort {
    return this.serialPort;
  }
}
