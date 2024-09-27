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
});
