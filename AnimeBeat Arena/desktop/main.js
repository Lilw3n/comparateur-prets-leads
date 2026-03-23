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
let slotLoadedUrls = [];
let slotSourceIds = ["live-1", "live-2", "kick", "twitch"];
let slotLastLiveIds = ["live-1", "live-2", "kick", "twitch"];
let screenCount = 4;
const APP_SITE_URL = "https://animebeat-arena.vercel.app";
const TOOLBAR_HEIGHT = 56;

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

function getGridSize(count) {
  if (count <= 1) return { columns: 1, rows: 1 };
  if (count === 2) return { columns: 2, rows: 1 };
  return { columns: 2, rows: 2 };
}

function ensureSlotLoaded(slotIndex) {
  const source = getSourceById(slotSourceIds[slotIndex]);
  const view = slotViews[slotIndex];
  if (!view) return;
  if (slotLoadedUrls[slotIndex] !== source.url) {
    view.webContents.loadURL(source.url);
    slotLoadedUrls[slotIndex] = source.url;
  }
}

function applyLayout() {
  if (!mainWindow) return;
  const [width, height] = mainWindow.getContentSize();
  detachAllViews();

  const activeCount = Math.max(1, Math.min(4, screenCount));
  const { columns, rows } = getGridSize(activeCount);
  const availableHeight = height - TOOLBAR_HEIGHT;
  const baseCellWidth = Math.floor(width / columns);
  const baseCellHeight = Math.floor(availableHeight / rows);

  for (let i = 0; i < activeCount; i += 1) {
    ensureSlotLoaded(i);
    const view = slotViews[i];
    if (!view) continue;
    const row = Math.floor(i / columns);
    const col = i % columns;
    const x = col * baseCellWidth;
    const y = TOOLBAR_HEIGHT + row * baseCellHeight;
    const isLastCol = col === columns - 1;
    const isLastRow = row === rows - 1;
    const cellWidth = isLastCol ? width - x : baseCellWidth;
    const cellHeight = isLastRow ? height - y : baseCellHeight;
    ensureAttached(view);
    view.setBounds({ x, y, width: cellWidth, height: cellHeight });
    view.setAutoResize({ width: true, height: true });
  }

  const labels = slotSourceIds
    .slice(0, activeCount)
    .map((id, idx) => `E${idx + 1}: ${getSourceById(id).title}`)
    .join(" | ");
  mainWindow.setTitle(`AnimeBeat Live Hub - ${activeCount} ecran(s) - ${labels}`);
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

  applyLayout();

  mainWindow.on("resize", applyLayout);
  mainWindow.on("closed", () => {
    mainWindow = null;
    slotViews = [];
    slotLoadedUrls = [];
  });

  mainWindow.webContents.on("before-input-event", (_, input) => {
    if (!input.control || input.type !== "keyDown") return;
    if (input.key === "1") {
      screenCount = 1;
      applyLayout();
    } else if (input.key === "2") {
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
    }
  });
}

ipcMain.on("set-screen-count", (_, count) => {
  const nextCount = Number(count);
  if (!Number.isInteger(nextCount) || nextCount < 1 || nextCount > 4) return;
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

