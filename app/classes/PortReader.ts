import SerialPort from 'serialport';
import { ERROR, LOG } from '../helpers/util';

export class PortReader {
  private serialPort: SerialPort;

  constructor(serialPort: string, params: { baudRate?: number }) {
    this.serialPort = new SerialPort(serialPort, {
      baudRate: params.baudRate || 9600,
    });
    this.serialPort.open((err) => {
      if (err) {
        return console.error('Error opening the port:', err.message);
      }
      LOG(
        `Serial port opened at ${serialPort} with baud rate ${params.baudRate}`
      );
    });
  }

  public readPort(): void {
    this.serialPort.on('data', (data: { toString: () => string }) => {
      const line = data.toString().trim();
      if (line) {
        try {
          const value = parseFloat(line);
          // TODO here we want to do something with save data
          // the "SensorData" job was to store a timestamp and a sensor value
          // in this case, however, we might want to save to file AND send to the server for rendering
          // const data = new SensorData({ value });
          // data.save();
          LOG(`Saved value: ${value}`);
        } catch (error) {
          ERROR(`Invalid data ${line}: ${error}`);
        }
      }
    });
  }

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
