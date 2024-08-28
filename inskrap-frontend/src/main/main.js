import { app, BrowserWindow } from 'electron';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);

const dirName = dirname(filename);




// const preloadPath = path.join(__dirname, 'preload.js');


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.resolve(dirName, 'preload.mjs'), // Ensure this is an absolute path
      nodeIntegration: true,
      contextIsolation: true,
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
