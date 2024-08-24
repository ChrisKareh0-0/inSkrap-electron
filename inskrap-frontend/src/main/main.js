import { app, BrowserWindow } from 'electron';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);




// const preloadPath = path.join(__dirname, 'preload.js');


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.resolve(__dirname, 'path/to/preload.js'), // Ensure this is an absolute path
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  console.log("[+] main.mjs line 20 function CreatWindow")

  win.loadURL(`http://localhost:3001`);

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
