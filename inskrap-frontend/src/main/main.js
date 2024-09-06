import { app, BrowserWindow } from "electron";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
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

  // Use spawn to run the appropriate command
  pythonProcess = spawn(command, args, {
    cwd, // Set the current working directory
  });

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("error", (err) => {
    console.error(`Error starting backend: ${err.message}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Process exited with code ${code}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.resolve(dirName, "../preload/preload.mjs"), // Ensure this is an absolute path
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  console.log("[+] main.mjs line 20 function createWindow");

  // Check if it's running in development or production
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:3001");
  } else {
    win.loadFile(path.resolve(dirName, "../renderer/index.html"));
  }
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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (pythonProcess) pythonProcess.kill();
});
