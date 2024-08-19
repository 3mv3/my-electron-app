const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electron', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  nodeV: () => process.versions.node,
  chromeV: () => process.versions.chrome,
  electronV: () => process.versions.electron,
  queryDb: (db, collection, query) => ipcRenderer.invoke('queryDb', db, collection, query),
  insertOneDb: (db, collection, query, data) => ipcRenderer.invoke('insertOneDb', db, collection, query, data),
  launchModal: (url) => ipcRenderer.invoke('launchModal', url),
  getNodeVersion: () => ipcRenderer.invoke('node:version')
});