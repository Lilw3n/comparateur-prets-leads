const { app, BrowserWindow, BrowserView, ipcMain, shell } = require("electron");
const path = require("path");

const LIVE_URLS = [
  {
    title: "TikTok Live 1",
    url: "https://www.tiktok.com/@idontlikeuspam/live",
  },
  {
    title: "TikTok Live 2",
    url: "https://www.tiktok.com/@kanekiakadiddy/live",
  },
  {
    title: "Kick Live",
    url: "https://kick.com/lilwen54",
  },
  {
    title: "Twitch Live",
    url: "https://www.twitch.tv/lilwen54",
  },
];

let mainWindow = null;
let liveViews = [];
let siteView = null;
let mode = "tabs";
let activeIndex = 0;
let splitSecondaryIndex = 1;
let selectedIndexes = [0, 1, 2, 3];
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

function applyLayout() {
  if (!mainWindow) return;
  const [width, height] = mainWindow.getContentSize();
  detachAllViews();

  if (mode === "site") {
    if (!siteView) return;
    ensureAttached(siteView);
    siteView.setBounds({ x: 0, y: TOOLBAR_HEIGHT, width, height: height - TOOLBAR_HEIGHT });
    siteView.setAutoResize({ width: true, height: true });
    mainWindow.setTitle("AnimeBeat Live Hub - Site complet");
    return;
  }

  if (mode === "custom-grid") {
    const validIndexes = selectedIndexes.filter((i) => i >= 0 && i < liveViews.length);
    const views = validIndexes.map((i) => liveViews[i]).filter(Boolean);
    if (views.length === 0) {
      const fallback = liveViews[activeIndex] || liveViews[0];
      if (!fallback) return;
      ensureAttached(fallback);
      fallback.setBounds({ x: 0, y: TOOLBAR_HEIGHT, width, height: height - TOOLBAR_HEIGHT });
      fallback.setAutoResize({ width: true, height: true });
      mainWindow.setTitle("AnimeBeat Live Hub - Aucun ecran selectionne");
      return;
    }

    const availableHeight = height - TOOLBAR_HEIGHT;
    const columns = Math.ceil(Math.sqrt(views.length));
    const rows = Math.ceil(views.length / columns);
    const baseCellWidth = Math.floor(width / columns);
    const baseCellHeight = Math.floor(availableHeight / rows);

    views.forEach((view, idx) => {
      const row = Math.floor(idx / columns);
      const col = idx % columns;
      const x = col * baseCellWidth;
      const y = TOOLBAR_HEIGHT + row * baseCellHeight;
      const isLastCol = col === columns - 1;
      const isLastRow = row === rows - 1;
      const cellWidth = isLastCol ? width - x : baseCellWidth;
      const cellHeight = isLastRow ? height - y : baseCellHeight;
      ensureAttached(view);
      view.setBounds({ x, y, width: cellWidth, height: cellHeight });
      view.setAutoResize({ width: true, height: true });
    });

    const labels = validIndexes.map((i) => LIVE_URLS[i].title).join(" + ");
    mainWindow.setTitle(`AnimeBeat Live Hub - Ecrans choisis: ${labels}`);
    return;
  }

  if (mode === "split") {
    const left = liveViews[activeIndex];
    const right = liveViews[splitSecondaryIndex];
    if (!left || !right) return;
    ensureAttached(left);
    ensureAttached(right);
    left.setBounds({ x: 0, y: TOOLBAR_HEIGHT, width: Math.floor(width / 2), height: height - TOOLBAR_HEIGHT });
    right.setBounds({
      x: Math.floor(width / 2),
      y: TOOLBAR_HEIGHT,
      width: width - Math.floor(width / 2),
      height: height - TOOLBAR_HEIGHT,
    });
    left.setAutoResize({ width: true, height: true });
    right.setAutoResize({ width: true, height: true });
    mainWindow.setTitle(
      `AnimeBeat Live Hub - Split: ${LIVE_URLS[activeIndex].title} + ${LIVE_URLS[splitSecondaryIndex].title} (Ctrl+1..5)`,
    );
    return;
  }

  if (mode === "quad") {
    const availableHeight = height - TOOLBAR_HEIGHT;
    const cellWidthLeft = Math.floor(width / 2);
    const cellWidthRight = width - cellWidthLeft;
    const cellHeightTop = Math.floor(availableHeight / 2);
    const cellHeightBottom = availableHeight - cellHeightTop;

    for (let i = 0; i < Math.min(4, liveViews.length); i += 1) {
      ensureAttached(liveViews[i]);
      const isLeft = i % 2 === 0;
      const isTop = i < 2;
      liveViews[i].setBounds({
        x: isLeft ? 0 : cellWidthLeft,
        y: TOOLBAR_HEIGHT + (isTop ? 0 : cellHeightTop),
        width: isLeft ? cellWidthLeft : cellWidthRight,
        height: isTop ? cellHeightTop : cellHeightBottom,
      });
      liveViews[i].setAutoResize({ width: true, height: true });
    }

    mainWindow.setTitle("AnimeBeat Live Hub - 4 ecrans (Ctrl+1..6)");
    return;
  }

  const active = liveViews[activeIndex];
  ensureAttached(active);
  active.setBounds({ x: 0, y: TOOLBAR_HEIGHT, width, height: height - TOOLBAR_HEIGHT });
  active.setAutoResize({ width: true, height: true });
  mainWindow.setTitle(
    `AnimeBeat Live Hub - ${LIVE_URLS[activeIndex].title} (Ctrl+1..6)`,
  );
}

function switchToTab(index) {
  if (index < 0 || index >= LIVE_URLS.length) return;
  mode = "tabs";
  activeIndex = index;
  splitSecondaryIndex = (index + 1) % LIVE_URLS.length;
  applyLayout();
}

function switchToSplit() {
  mode = "split";
  if (splitSecondaryIndex === activeIndex) {
    splitSecondaryIndex = (activeIndex + 1) % LIVE_URLS.length;
  }
  applyLayout();
}

function switchToQuad() {
  mode = "quad";
  applyLayout();
}

function switchToCustomGrid(indexes) {
  const unique = Array.from(new Set(indexes))
    .map((i) => Number(i))
    .filter((i) => Number.isInteger(i) && i >= 0 && i < LIVE_URLS.length);
  selectedIndexes = unique.length > 0 ? unique : [activeIndex];
  mode = "custom-grid";
  applyLayout();
}

function switchToSite() {
  mode = "site";
  if (siteView && siteView.webContents.getURL() !== APP_SITE_URL) {
    siteView.webContents.loadURL(APP_SITE_URL);
  }
  applyLayout();
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

  liveViews = LIVE_URLS.map((live) => {
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

    view.webContents.loadURL(live.url);
    return view;
  });

  siteView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    },
  });
  siteView.webContents.setWindowOpenHandler(({ url: nextUrl }) => {
    shell.openExternal(nextUrl);
    return { action: "deny" };
  });
  siteView.webContents.loadURL(APP_SITE_URL);

  applyLayout();

  mainWindow.on("resize", applyLayout);
  mainWindow.on("closed", () => {
    mainWindow = null;
    liveViews = [];
  });

  mainWindow.webContents.on("before-input-event", (_, input) => {
    if (!input.control || input.type !== "keyDown") return;
    if (input.key === "1") {
      switchToTab(0);
    } else if (input.key === "2") {
      switchToTab(1);
    } else if (input.key === "3") {
      switchToTab(2);
    } else if (input.key === "4") {
      switchToTab(3);
    } else if (input.key === "5") {
      switchToSplit();
    } else if (input.key === "6") {
      switchToQuad();
    } else if (input.key === "7") {
      switchToCustomGrid(selectedIndexes);
    } else if (input.key === "8") {
      switchToSite();
    } else if (input.key.toLowerCase() === "f") {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });
}

ipcMain.on("set-mode", (_, nextMode) => {
  if (nextMode === "tab-1") {
    switchToTab(0);
  } else if (nextMode === "tab-2") {
    switchToTab(1);
  } else if (nextMode === "tab-3") {
    switchToTab(2);
  } else if (nextMode === "tab-4") {
    switchToTab(3);
  } else if (nextMode === "split") {
    switchToSplit();
  } else if (nextMode === "quad") {
    switchToQuad();
  } else if (nextMode === "custom-grid") {
    switchToCustomGrid(selectedIndexes);
  } else if (nextMode === "site") {
    switchToSite();
  } else {
    return;
  }
});

ipcMain.on("set-selection", (_, indexes) => {
  if (!Array.isArray(indexes)) return;
  switchToCustomGrid(indexes);
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

