import { PortReader } from "../classes/PortReader";

// SERIAL_PORT = 'COM5'  # Replace with your serial port (e.g., '/dev/ttyACM0' on Linux or 'COM3' on Windows)
// BAUD_RATE = 9600

function startReadFromSerial(serialPort: string, baudRate: number): PortReader | undefined {
  let port;
  try {
    port = new PortReader(serialPort, { baudRate });
    console.log(`Connected to ${serialPort} at ${baudRate} baud.`);
    port.readPort();
    return port;
  } catch (error) {
    console.error(`Error reading from port ${serialPort}:`, error);
  } finally {
    if (port) {
      let res = port.closePort();
      if (res.message === 'success') {
        console.log('Port closed successfully.');
      } else {
        console.error('Error closing port.');
      }
    }
  }
}

function stopReadFromSerial(portReader: PortReader) {
  let res = portReader.closePort();
  if (res.message === 'success') {
    console.log('Port closed successfully.');
  } else {
    console.error('Error closing port.');
  }
}

export { startReadFromSerial, stopReadFromSerial };