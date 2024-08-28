import __cjs_mod__ from "node:module";

const require2 = __cjs_mod__.createRequire(import.meta.url);
const { app, BrowserWindow } = require2("electron");
const path = require2("path");
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join("preload.mjs"),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  // win.loadURL("http://localhost:5173");
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
