const { app, BrowserWindow, BrowserView, ipcMain, shell } = require("electron");
const path = require("path");

const LIVE_SOURCES = [
  { id: "live-1", title: "TikTok Live 1", url: "https://www.tiktok.com/@idontlikeuspam/live" },
  { id: "live-2", title: "TikTok Live 2", url: "https://www.tiktok.com/@kanekiakadiddy/live" },
  { id: "kick", title: "Kick Live", url: "https://kick.com/lilwen54" },
  { id: "twitch", title: "Twitch Live", url: "https://www.twitch.tv/lilwen54" },
];

let mainWindow = null;
let slotViews = [];
let chatView = null;
let slotLoadedUrls = [];
let slotSourceIds = ["live-1", "live-2", "kick", "twitch"];
let slotLastLiveIds = ["live-1", "live-2", "kick", "twitch"];
let sourcePower = {
  "live-1": true,
  "live-2": true,
  kick: true,
  twitch: true,
};
let screenCount = 2;
const APP_SITE_URL = "https://animebeat-arena.vercel.app";
const TOOLBAR_HEIGHT = 132;
const CHAT_PANEL_WIDTH = 380;
let chatVisible = true;
let chatMode = "mix";

function ensureAttached(view) {
  if (!mainWindow.getBrowserViews().includes(view)) {
    mainWindow.addBrowserView(view);
  }
}

function detachAllViews() {
  for (const view of mainWindow.getBrowserViews()) {
    mainWindow.removeBrowserView(view);
  }
}

function getSourceById(id) {
  if (id === "site") {
    return { id: "site", title: "Site complet", url: APP_SITE_URL };
  }
  return LIVE_SOURCES.find((source) => source.id === id) ?? LIVE_SOURCES[0];
}

function getFirstPoweredLiveId() {
  return LIVE_SOURCES.find((source) => sourcePower[source.id])?.id ?? LIVE_SOURCES[0].id;
}

function getOffPlaceholderUrl(sourceTitle) {
  const html = `<!doctype html><html><body style="margin:0;background:#0a1022;color:#d5dcff;font-family:Segoe UI,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;"><div style="text-align:center;opacity:.92"><div style="font-size:14px;font-weight:600;">${sourceTitle}</div><div style="margin-top:8px;font-size:12px;opacity:.82;">Chaîne éteinte</div></div></body></html>`;
  return `data:text/html;charset=UTF-8,${encodeURIComponent(html)}`;
}

function getChatModeLabel(mode) {
  if (mode === "mix") return "Mix";
  if (mode === "kick") return "Kick";
  if (mode === "twitch") return "Twitch";
  return "TikTok";
}

function getChatPanelHtml(mode) {
  const twitch = "https://www.twitch.tv/popout/lilwen54/chat";
  const kick = "https://kick.com/lilwen54";
  const tiktok1 = "https://www.tiktok.com/@idontlikeuspam/live";
  const tiktok2 = "https://www.tiktok.com/@kanekiakadiddy/live";
  const showTwitch = mode === "mix" || mode === "twitch";
  const showKick = mode === "mix" || mode === "kick";
  const showTikTok = mode === "mix" || mode === "tiktok";
  return `<!doctype html><html><body style="margin:0;background:#080f21;color:#e7edff;font-family:Segoe UI,sans-serif;">
  <div style="padding:10px;border-bottom:1px solid rgba(130,154,255,.3);font-size:12px;font-weight:600;">Chat ${getChatModeLabel(mode)}</div>
  <div style="padding:8px;display:flex;flex-direction:column;gap:8px;">
    ${showTwitch ? `<iframe title="Twitch chat" src="${twitch}" style="height:260px;border:1px solid rgba(130,154,255,.3);border-radius:8px;width:100%;"></iframe>` : ""}
    ${showKick ? `<iframe title="Kick chat" src="${kick}" style="height:260px;border:1px solid rgba(130,154,255,.3);border-radius:8px;width:100%;"></iframe>` : ""}
    ${
      showTikTok
        ? `<div style="border:1px solid rgba(130,154,255,.3);border-radius:8px;padding:10px;font-size:12px;line-height:1.4;">
      TikTok chat est souvent bloqué en iframe.<br/><a href="${tiktok1}" style="color:#9fb6ff;">Ouvrir TikTok 1</a><br/><a href="${tiktok2}" style="color:#9fb6ff;">Ouvrir TikTok 2</a>
    </div>`
        : ""
    }
  </div></body></html>`;
}

function ensureChatLoaded() {
  if (!chatView) return;
  const html = getChatPanelHtml(chatMode);
  const dataUrl = `data:text/html;charset=UTF-8,${encodeURIComponent(html)}`;
  chatView.webContents.loadURL(dataUrl);
}

function ensureSlotLoaded(slotIndex) {
  let sourceId = slotSourceIds[slotIndex];
  if (sourceId !== "site" && !sourcePower[sourceId]) {
    sourceId = getFirstPoweredLiveId();
    slotSourceIds[slotIndex] = sourceId;
  }
  const source = getSourceById(sourceId);
  const view = slotViews[slotIndex];
  if (!view) return;
  const targetUrl =
    source.id !== "site" && !sourcePower[source.id] ? getOffPlaceholderUrl(source.title) : source.url;
  if (slotLoadedUrls[slotIndex] !== targetUrl) {
    view.webContents.loadURL(targetUrl);
    slotLoadedUrls[slotIndex] = targetUrl;
  }
}

function applyLayout() {
  if (!mainWindow) return;
  const [width, height] = mainWindow.getContentSize();
  detachAllViews();

  const activeCount = Math.max(2, Math.min(4, screenCount));
  const availableHeight = height - TOOLBAR_HEIGHT;
  const streamWidth = chatVisible ? Math.max(680, width - CHAT_PANEL_WIDTH) : width;

  for (let i = 0; i < activeCount; i += 1) {
    ensureSlotLoaded(i);
  }

  if (activeCount === 2) {
    const leftWidth = Math.floor(streamWidth / 2);
    const rightWidth = streamWidth - leftWidth;
    const bounds = [
      { x: 0, y: TOOLBAR_HEIGHT, width: leftWidth, height: availableHeight },
      { x: leftWidth, y: TOOLBAR_HEIGHT, width: rightWidth, height: availableHeight },
    ];
    for (let i = 0; i < 2; i += 1) {
      const view = slotViews[i];
      if (!view) continue;
      ensureAttached(view);
      view.setBounds(bounds[i]);
      view.setAutoResize({ width: true, height: true });
    }
  } else if (activeCount === 3) {
    const leftWidth = Math.floor(streamWidth * 0.62);
    const rightWidth = streamWidth - leftWidth;
    const topRightHeight = Math.floor(availableHeight / 2);
    const bottomRightHeight = availableHeight - topRightHeight;
    const bounds = [
      { x: 0, y: TOOLBAR_HEIGHT, width: leftWidth, height: availableHeight },
      { x: leftWidth, y: TOOLBAR_HEIGHT, width: rightWidth, height: topRightHeight },
      { x: leftWidth, y: TOOLBAR_HEIGHT + topRightHeight, width: rightWidth, height: bottomRightHeight },
    ];
    for (let i = 0; i < 3; i += 1) {
      const view = slotViews[i];
      if (!view) continue;
      ensureAttached(view);
      view.setBounds(bounds[i]);
      view.setAutoResize({ width: true, height: true });
    }
  } else {
    const leftWidth = Math.floor(streamWidth / 2);
    const rightWidth = streamWidth - leftWidth;
    const topHeight = Math.floor(availableHeight / 2);
    const bottomHeight = availableHeight - topHeight;
    const bounds = [
      { x: 0, y: TOOLBAR_HEIGHT, width: leftWidth, height: topHeight },
      { x: leftWidth, y: TOOLBAR_HEIGHT, width: rightWidth, height: topHeight },
      { x: 0, y: TOOLBAR_HEIGHT + topHeight, width: leftWidth, height: bottomHeight },
      { x: leftWidth, y: TOOLBAR_HEIGHT + topHeight, width: rightWidth, height: bottomHeight },
    ];
    for (let i = 0; i < 4; i += 1) {
      const view = slotViews[i];
      if (!view) continue;
      ensureAttached(view);
      view.setBounds(bounds[i]);
      view.setAutoResize({ width: true, height: true });
    }
  }

  const labels = slotSourceIds
    .slice(0, activeCount)
    .map((id, idx) => `E${idx + 1}: ${getSourceById(id).title}`)
    .join(" | ");
  mainWindow.setTitle(`AnimeBeat Live Hub - ${activeCount} ecran(s) - ${labels}`);

  if (chatVisible && chatView) {
    ensureChatLoaded();
    ensureAttached(chatView);
    chatView.setBounds({
      x: streamWidth,
      y: TOOLBAR_HEIGHT,
      width: width - streamWidth,
      height: availableHeight,
    });
    chatView.setAutoResize({ width: true, height: true });
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 920,
    autoHideMenuBar: true,
    backgroundColor: "#070b19",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "toolbar.html"));

  slotViews = Array.from({ length: 4 }).map(() => {
    const view = new BrowserView({
      webPreferences: {
        contextIsolation: true,
        sandbox: true,
      },
    });

    view.webContents.setWindowOpenHandler(({ url: nextUrl }) => {
      shell.openExternal(nextUrl);
      return { action: "deny" };
    });
    return view;
  });
  slotLoadedUrls = ["", "", "", ""];
  chatView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    },
  });
  chatView.webContents.setWindowOpenHandler(({ url: nextUrl }) => {
    shell.openExternal(nextUrl);
    return { action: "deny" };
  });
  ensureChatLoaded();

  applyLayout();

  mainWindow.on("resize", applyLayout);
  mainWindow.on("closed", () => {
    mainWindow = null;
    slotViews = [];
    chatView = null;
    slotLoadedUrls = [];
  });

  mainWindow.webContents.on("before-input-event", (_, input) => {
    if (!input.control || input.type !== "keyDown") return;
    if (input.key === "2") {
      screenCount = 2;
      applyLayout();
    } else if (input.key === "3") {
      screenCount = 3;
      applyLayout();
    } else if (input.key === "4") {
      screenCount = 4;
      applyLayout();
    } else if (input.key.toLowerCase() === "f") {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    } else if (input.key.toLowerCase() === "c") {
      chatVisible = !chatVisible;
      applyLayout();
    }
  });
}

ipcMain.on("set-screen-count", (_, count) => {
  const nextCount = Number(count);
  if (!Number.isInteger(nextCount) || nextCount < 2 || nextCount > 4) return;
  screenCount = nextCount;
  applyLayout();
});

ipcMain.on("set-slot-source", (_, payload) => {
  if (!payload || typeof payload !== "object") return;
  const slotIndex = Number(payload.slotIndex);
  const sourceId = String(payload.sourceId);
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 3) return;

  if (sourceId === "site") {
    slotSourceIds[slotIndex] = "site";
  } else {
    const validLive = LIVE_SOURCES.some((source) => source.id === sourceId);
    if (!validLive) return;
    slotSourceIds[slotIndex] = sourceId;
    slotLastLiveIds[slotIndex] = sourceId;
  }
  applyLayout();
});

ipcMain.on("toggle-source-power", (_, payload) => {
  if (!payload || typeof payload !== "object") return;
  const sourceId = String(payload.sourceId);
  const powered = Boolean(payload.powered);
  const validLive = LIVE_SOURCES.some((source) => source.id === sourceId);
  if (!validLive) return;

  const poweredCount = Object.values(sourcePower).filter(Boolean).length;
  if (!powered && poweredCount <= 1) return;
  sourcePower[sourceId] = powered;

  slotSourceIds = slotSourceIds.map((id, idx) => {
    if (id !== sourceId) return id;
    const fallbackId = getFirstPoweredLiveId();
    slotLastLiveIds[idx] = fallbackId;
    return fallbackId;
  });
  applyLayout();
});

ipcMain.on("set-chat-visible", (_, visible) => {
  chatVisible = Boolean(visible);
  applyLayout();
});

ipcMain.on("set-chat-mode", (_, mode) => {
  const nextMode = String(mode);
  if (!["mix", "kick", "twitch", "tiktok"].includes(nextMode)) return;
  chatMode = nextMode;
  applyLayout();
});

ipcMain.on("set-slot-mode", (_, payload) => {
  if (!payload || typeof payload !== "object") return;
  const slotIndex = Number(payload.slotIndex);
  const mode = String(payload.mode);
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 3) return;

  if (mode === "site") {
    slotSourceIds[slotIndex] = "site";
  } else if (mode === "full") {
    slotSourceIds[slotIndex] = slotLastLiveIds[slotIndex] || LIVE_SOURCES[0].id;
  } else {
    return;
  }
  applyLayout();
});

ipcMain.on("toggle-fullscreen", () => {
  if (!mainWindow) return;
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

