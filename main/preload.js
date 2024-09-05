const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('indexBridge', {
  openWebsite: async (url) => {
    await ipcRenderer.invoke('openWebsite', url);
  }
});
