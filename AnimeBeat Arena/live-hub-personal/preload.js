const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("liveHub", {
  getHubMeta: () => ipcRenderer.invoke("get-hub-meta"),
  reloadHubConfig: () => ipcRenderer.send("reload-hub-config"),
  setScreenCount: (count) => ipcRenderer.send("set-screen-count", count),
  setSlotSource: (slotIndex, sourceId) => ipcRenderer.send("set-slot-source", { slotIndex, sourceId }),
  setSlotMode: (slotIndex, mode) => ipcRenderer.send("set-slot-mode", { slotIndex, mode }),
  setSourcePower: (sourceId, powered) => ipcRenderer.send("toggle-source-power", { sourceId, powered }),
  setChatVisible: (visible) => ipcRenderer.send("set-chat-visible", visible),
  setChatMode: (mode) => ipcRenderer.send("set-chat-mode", mode),
  toggleFullScreen: () => ipcRenderer.send("toggle-fullscreen"),
});
