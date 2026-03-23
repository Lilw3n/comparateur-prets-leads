const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("liveHub", {
  setMode: (mode) => ipcRenderer.send("set-mode", mode),
  setSelection: (indexes) => ipcRenderer.send("set-selection", indexes),
  toggleFullScreen: () => ipcRenderer.send("toggle-fullscreen"),
});

