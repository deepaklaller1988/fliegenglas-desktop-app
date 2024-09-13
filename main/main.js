import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProd = app.isPackaged;
const loadURL = isProd ? serve({ directory: join(__dirname, '../build') }) : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      enableRemoteModule: true // Required for accessing Electron's remote module

    }
  });

  if (isProd) {
    loadURL(win).then(() => {
      win.loadURL('app://-');
    });
  } else {
    win.loadURL('http://localhost:3000');
    win.webContents.on('did-fail-load', () => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('openWebsite', (event, url) => {
  if (url) {
    shell.openExternal(url);
  }
});
