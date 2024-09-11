import { app, BrowserWindow } from "electron";
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
    pythonProcess = null; // Ensure pythonProcess is set to null when closed
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

function killPythonProcess() {
  if (pythonProcess && pythonProcess.pid) {
    try {
      execSync(`taskkill /PID ${pythonProcess.pid} /T /F`); // Synchronously kill the process
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
      event.preventDefault(); // Prevent the app from quitting immediately
      killPythonProcess(); // Kill the Python process

      // Once the process is killed, exit the app
      app.exit();
    }
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Ensure the Python process is terminated when the app exits
process.on("exit", () => {
  if (pythonProcess && pythonProcess.pid) {
    pythonProcess.kill();
  }
});
