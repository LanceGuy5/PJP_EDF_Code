const { SerialPort } = require('serialport');

/**
 * Function to read info about each port -> print out info
 */
function listPorts() {
  return SerialPort.list() // Return the promise from SerialPort.list()
    .then((ports) => {
      let ret = ''; // Declare ret inside the function scope
      ports.forEach((port) => {
        ret += `Port: ${port.path}, PnP ID: ${port.pnpId || 'N/A'}, Manufacturer: ${port.manufacturer || 'N/A'}\n`;
      });
      return ret; // Return the result after processing the ports
    })
    .catch((err) => {
      console.error('Error listing ports:', err);
      throw err; // Re-throw the error so it can be caught by the caller
    });
}

function readFromPort(serialPort, params) {
  serialPort = new SerialPort(serialPort, {
    baudRate: params.baudRate || 9600,
  });
  serialPort.on('data', (data) => {
    const sensorData = data.toString();
    const parsedData = sensorData.split('#');
    parsedData.forEach((sensor) => {
      if (sensor.trim() !== '') {
        LOG(`Sensor data: ${sensor}`);
      }
    });
  });
}

module.exports = { listPorts, readFromPort };
