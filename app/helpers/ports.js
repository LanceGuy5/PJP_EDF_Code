// eslint-disable-next-line
const { SerialPort } = require('serialport');

/**
 * Function to read info about each port -> print out info
 */
function listPorts() {
  return SerialPort.list() // Return the promise from SerialPort.list()
    .then((ports) => {
      let ret = ''; // Declare ret inside the function scope
      ports.forEach((port) => {
        ret += `Port: ${port.path}, PnP ID: ${port.pnpId || 'N/A'}, Manufacturer: ${port.manufacturer || 'N/A'}&`;
      });
      return ret; // Return the result after processing the ports
    })
    .catch((err) => {
      console.error('Error listing ports:', err);
      throw err; // Re-throw the error so it can be caught by the caller
    });
}

function readFromPort(path, options) {
  try {
    const serial = new SerialPort({ path, ...options });

    // Buffer to accumulate incoming data
    let buffer = '';

    // Define the order of sensor types as per Arduino's data output
    const sensorTypes = [
      'timestamp',
      'temperature',
      'load',
      'fuel_flow',
      'air_velocity',
    ];

    // Event listener for incoming data
    serial.on('data', (data) => {
      // Append incoming data to buffer
      buffer += data.toString();

      // Process all complete data blocks within the buffer
      let start = buffer.indexOf('%');

      while (start !== -1) {
        // Find the next '%' after the current start
        let end = buffer.indexOf('%', start + 1);

        // If there's no closing '%', wait for more data
        if (end === -1) {
          break;
        }

        // Extract the data block between two '%' symbols
        const dataBlock = buffer.substring(start + 1, end);

        // Remove the processed data block from buffer
        buffer = buffer.substring(end + 1);

        // Split the data block by commas to get individual sensor values
        const parsedData = dataBlock.split(',');

        // Check if the number of data points matches the number of sensor types
        if (parsedData.length === sensorTypes.length) {
          // Iterate through each sensor value and its corresponding type
          parsedData.forEach((sensorValue, index) => {
            const type = sensorTypes[index];
            const value = sensorValue.trim();

            if (type && value !== '') {
              console.log(`${type}: ${value}`);
            } else {
              console.warn(`Missing data for sensor type: ${type}`);
            }
          });
        } else {
          console.warn('Unexpected data format:', dataBlock);
        }

        // Update the start position for the next iteration
        start = buffer.indexOf('%');
      }
    });

    // Handle serial port errors
    // TODO We need this to be more functional
    serial.on('error', (err) => {
      console.error('Error on serial port:', err.message);
    });
    return serial; // Return the serial port object for further manipulation if needed
  } catch (error) {
    console.error('Error initializing SerialPort:', error.message);
    throw error; // Re-throw the error to handle it at a higher level if necessary
  }
}

module.exports = { listPorts, readFromPort };
