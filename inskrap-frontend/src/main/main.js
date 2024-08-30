import { app, BrowserWindow } from 'electron';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';  // Load .env file

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

  // Check if it's running in development or production
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3001');
  } else {
    win.loadFile(path.resolve(dirName, "../renderer/dist/index.html"));
  }
  
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
