import { SerialPort } from 'serialport';

/**
 * Function to read info about each port -> print out info
 */
function listPorts() {
  SerialPort.list()
    .then((ports) => {
      ports.forEach((port) => {
        console.log(
          `Port: ${port.path}, PnP ID: ${port.pnpId}, Manufacturer: ${port.manufacturer}`
        );
      });
    })
    .catch((err) => {
      console.error('Error listing ports:', err);
    });
}

export { listPorts };
