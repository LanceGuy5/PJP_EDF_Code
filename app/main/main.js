const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { listPorts, readFromPort } = require('../helpers/ports.js');

let serve;
const serialPorts = {}; // {path: index[]}
const pathToObjectMap = {}; // {path: serialPort}
let win;

const createWindow = async () => {
  console.log(`[APP]: ${path.join(__dirname, '../icon.png')}`);
  win = new BrowserWindow({
    // width: 800,
    // height: 600,
    title: 'Penn Jet Propulsion Metrics Suite',
    backgroundColor: '#000000',
    fullscreen: true,
    icon: path.join(__dirname, '../icon.png'),
    webPreferences: {
      nodeIntegration: false, // Ensure nodeIntegration is false for security
      contextIsolation: true, // Ensure contextIsolation is true for security
      preload: path.join(__dirname, 'app/preload.js'),
    },
  });

  // set dock image
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, '../icon.png'));
  }

  // Load the loading screen
  await win.loadFile(path.join(__dirname, '../html/loading.html'));

  // Load electron-serve dynamically using import()
  if (app.isPackaged) {
    if (!serve) {
      serve = (await import('electron-serve')).default;
    }

    const appServe = serve({
      directory: path.join(__dirname, '../out'),
    });

    appServe(win).then(() => {
      win.loadURL('app://-');
    });
  } else {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools(); // only use if devtools needs to be open
    win.webContents.on('did-fail-load', (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on('ready', () => {
  createWindow();

  ipcMain.handle('loadDashboard', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    return result; // Return the result back to the renderer
  });
  ipcMain.handle('listPorts', async () => {
    const result = await listPorts();
    return result;
  });
  ipcMain.handle('readFromPort', async (event, path, options, index) => {
    if (serialPorts[path] && serialPorts[path].includes(index)) {
      return;
    }
    if (serialPorts[path]) {
      console.log(serialPorts + '   ' + serialPorts[path]);
      serialPorts[path].push(index);
    } else {
      serialPorts[path] = [index];
      // serialPorts[path] passed as reference
      const serialPort = readFromPort(path, options, win, serialPorts[path]);
      pathToObjectMap[path] = serialPort;
    }
  });
  ipcMain.handle('stopReading', async (event, path, index) => {
    if (serialPorts[path] && serialPorts[path].includes(index)) {
      serialPorts[path].splice(serialPorts[path].indexOf(index), 1);
      if (serialPorts[path].length === 0) {
        pathToObjectMap[path].close();
        delete pathToObjectMap[path];
        delete serialPorts[path];
      }
    }
  });
});

app.on('before-quit', () => {
  // TODO Make sure all code is cleaned up
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
