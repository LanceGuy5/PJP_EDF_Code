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
  readFromPort: async (params) => {
    console.log(
      `[PRELOAD]: readPort called with port ${params.path} and params ${JSON.stringify(params.options)}`
    );
    await ipcRenderer.invoke(
      'readFromPort',
      params.path,
      params.options,
      params.index
    );
  },
  stopReading: async (params) => {
    await ipcRenderer.invoke('stopReading', params.path, params.index);
  },
  dataUpdate: (params) => {
    console.log('[PRELOAD]: stopReading called on id', params.id);
    ipcRenderer.on(`dataUpdate-${params.id}`, (event, data) =>
      params.callback(data)
    );
  },
  removeListener: (params) => {
    console.log('[PRELOAD]: removeListener called on channel', params.channel);
    ipcRenderer.removeListener(params.channel, params.callback);
  },
});
