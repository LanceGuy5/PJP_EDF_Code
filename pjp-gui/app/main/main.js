const { app, BrowserWindow } = require("electron");
const path = require("path");

let serve;

const createWindow = async () => {
  console.log(`[APP]: ${path.join(__dirname, "../icon.png")}`)
  const win = new BrowserWindow({
    // width: 800,
    // height: 600,
    backgroundColor: "#000000",
    fullscreen: true,
    icon: path.join(__dirname, "../icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "app/preload.ts")
    }
  });

  // set dock image
  if (process.platform === "darwin") {
    app.dock.setIcon(path.join(__dirname, "../icon.png"));
  }

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
    // win.webContents.openDevTools(); // only use if devtools needs to be open
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
