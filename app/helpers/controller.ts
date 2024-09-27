import { PortReader } from '../classes/PortReader';
import { ERROR, LOG } from './util';

// SERIAL_PORT = 'COM5'  # Replace with your serial port (e.g., '/dev/ttyACM0' on Linux or 'COM3' on Windows)
// BAUD_RATE = 9600

function startReadFromSerial(
  serialPort: string,
  baudRate: number
): PortReader | undefined {
  let port;
  try {
    port = new PortReader(serialPort, { baudRate });
    LOG(`Connected to ${serialPort} at ${baudRate} baud.`);
    port.readPort();
    return port;
  } catch (error) {
    console.error(`Error reading from port ${serialPort}:`, error);
  } finally {
    if (port) {
      const res = port.closePort();
      if (res.message === 'success') {
        LOG('Port closed successfully.');
      } else {
        console.error('Error closing port.');
      }
    }
  }
}

function stopReadFromSerial(portReader: PortReader) {
  const res = portReader.closePort();
  if (res.message === 'success') {
    LOG('Port closed successfully.');
  } else {
    ERROR('Error closing port.');
  }
}

export { startReadFromSerial, stopReadFromSerial };
