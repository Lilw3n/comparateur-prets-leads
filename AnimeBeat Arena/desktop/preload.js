const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("liveHub", {
  setScreenCount: (count) => ipcRenderer.send("set-screen-count", count),
  setSlotSource: (slotIndex, sourceId) => ipcRenderer.send("set-slot-source", { slotIndex, sourceId }),
  setSlotMode: (slotIndex, mode) => ipcRenderer.send("set-slot-mode", { slotIndex, mode }),
  toggleFullScreen: () => ipcRenderer.send("toggle-fullscreen"),
});

