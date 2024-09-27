import SerialPort from 'serialport';
import { LOG } from './util';

/**
 * Function to read info about each port -> print out info
 */
function listPorts() {
  SerialPort.list()
    .then((ports) => {
      ports.forEach((port) => {
        LOG(
          `Port: ${port.path}, PnP ID: ${port.pnpId}, Manufacturer: ${port.manufacturer}`
        );
      });
    })
    .catch((err) => {
      console.error('Error listing ports:', err);
    });
}

export { listPorts };
