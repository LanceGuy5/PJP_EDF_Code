const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  on: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  },
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  },
  loadDashboard: async () => {
    console.log('[PRELOAD]: loadDashboard called');
    const result = await ipcRenderer.invoke('loadDashboard');
    return result;
  },
  listPorts: async () => {
    console.log('[PRELOAD]: listPorts called');
    const result = await ipcRenderer.invoke('listPorts');
    return result;
  },
  readPort: async (port) => {
    console.log(`[PRELOAD]: readPort called with port ${port}`);
    const result = await ipcRenderer.invoke('readPort', port);
    return result;
  },
});
