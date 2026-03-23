const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("liveHub", {
  setMode: (mode) => ipcRenderer.send("set-mode", mode),
});

