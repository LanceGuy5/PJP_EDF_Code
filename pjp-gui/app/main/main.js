const { app, BrowserWindow } = require("electron");
const path = require("path");

let serve;  // Declare this to hold electron-serve

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  // Load electron-serve dynamically using import()
  if (app.isPackaged) {
    if (!serve) {
      serve = (await import("electron-serve")).default;
    }

    const appServe = serve({
      directory: path.join(__dirname, "../out")
    });

    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
