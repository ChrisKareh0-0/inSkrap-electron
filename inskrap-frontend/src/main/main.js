import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { spawn, execSync } from "child_process";
import "dotenv/config";

const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

let pythonProcess = null;

function startPythonBackend() {
  let command;
  let args = [];
  let cwd;

  if (process.env.NODE_ENV === "development") {
    command = "python";
    args = [path.join(dirName, "../../../backend-app/app.py")];
    cwd = path.dirname(args[0]);
  } else {
    command = path.join(process.resourcesPath, "server.exe");
    cwd = path.dirname(command);
  }

  pythonProcess = spawn(command, args, {
    cwd, // Set the current working directory
  });

  pythonProcess.on("close", (code) => {
    console.log(`Process exited with code ${code}`);
    pythonProcess = null; // Ensure pythonProcess is set to null when closed
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 900,
    minHeight: 700,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.resolve(dirName, "../preload/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:3001");
  } else {
    win.loadFile(path.resolve(dirName, "../renderer/index.html"));
  }

  // IPC Handlers
  ipcMain.on("window-minimize", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.minimize();
    }
  });

  ipcMain.on("window-maximize", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      if (focusedWindow.isMaximized()) {
        focusedWindow.unmaximize();
      } else {
        focusedWindow.maximize();
      }
    }
  });

  ipcMain.on("window-close", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.close();
    }
  });
}

app.whenReady().then(() => {
  startPythonBackend();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function killPythonProcess() {
  if (pythonProcess && pythonProcess.pid) {
    try {
      execSync(`taskkill /PID ${pythonProcess.pid} /T /F`);
      console.log(`Python process ${pythonProcess.pid} killed`);
    } catch (error) {
      console.error(`Error killing Python process: ${error.message}`);
    }
  }
}

app.on("before-quit", (event) => {
  if (process.env.NODE_ENV === "development") {
    pythonProcess.kill();
    app.exit();
  } else {
    if (pythonProcess && pythonProcess.pid) {
      if (process.platform === "win32") {
        event.preventDefault();
        killPythonProcess();
        app.exit();
      } else {
        pythonProcess.kill();
        app.exit();
      }
    }
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

process.on("exit", () => {
  if (pythonProcess && pythonProcess.pid) {
    pythonProcess.kill();
  }
});
