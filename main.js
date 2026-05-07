const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 200,
    height: 200,

    frame: false,          // removes window border
    transparent: true,     // removes background
    resizable: false,
    alwaysOnTop: true,
    hasShadow: false,

    webPreferences: {
      nodeIntegration: true
    }
  });

  win.setAlwaysOnTop(true, "screen-saver");

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
