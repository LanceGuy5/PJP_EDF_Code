const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { listPorts, readFromPort } = require('../helpers/ports.js');

let serve;
const serialPorts = [];

const createWindow = async () => {
  console.log(`[APP]: ${path.join(__dirname, '../icon.png')}`);
  const win = new BrowserWindow({
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
  ipcMain.handle('readFromPort', async (event, path, options) => {
    const serialPort = readFromPort(path, options);
    // TODO assign each one to a different id
    serialPorts.push(serialPort);
  });
  ipcMain.handle('stopAllReadings', async () => {
    serialPorts.forEach((port) => {
      port.close();
    });
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
