import { SerialPort } from "serialport";

export class PortReader {

  private serialPort: SerialPort;
  private params: {
    baudRate?: number
  };

  constructor(serialPort: string, params: {baudRate?: number}) {
    this.serialPort = new SerialPort({
      path: serialPort,
      baudRate: params.baudRate || 9600
    });
    this.serialPort.open((err) => {
      if (err) {
        return console.error('Error opening the port:', err.message);
      }
      console.log(`Serial port opened at ${serialPort} with baud rate ${params.baudRate}`);
    });
    this.params = params;
  }

  public readPort(): void {
    this.serialPort.on('data', (data) => {
      const line = data.toString().trim();
      if (line) {
        try {
          const value = parseFloat(line);
          // TODO here we want to do something with save data
          // the "SensorData" job was to store a timestamp and a sensor value
          // in this case, however, we might want to save to file AND send to the server for rendering
          // const data = new SensorData({ value });
          // data.save();
          console.log(`Saved value: ${value}`);
        } catch (error) {
          console.error(`Invalid data: ${line}`);
        }
      }
    });
  }

  public closePort(): {'message': 'success' | 'failure'} {
    this.serialPort.close((err) => {
      if (err) {
        console.error('Error closing port:', err);
        return {'message': 'failure'};
      } else {
        console.log('Port closed.');
        return {'message': 'success'};
      }
    });
    return {'message': 'failure'};
  }

  public getSerialPort(): SerialPort {
    return this.serialPort;
  }
}