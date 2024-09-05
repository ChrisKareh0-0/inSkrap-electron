import { app, BrowserWindow } from "electron";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process"; // Import spawn to run Python script
import "dotenv/config"; // Load .env file

const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

// Declare variable to hold the Python process
let pythonProcess = null;

function startPythonBackend() {
  const script =
    process.env.NODE_ENV === "production"
      ? path.join(dirName, "../../../python-backend/app.py")
      : path.join(dirName, "../../../backend-app/app.py");
  pythonProcess = spawn("python", [script]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
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
  startPythonBackend(); // Start the Python backend
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
  if (pythonProcess) pythonProcess.kill(); // Ensure the Python process is terminated when the app quits
});
