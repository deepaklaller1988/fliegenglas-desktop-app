import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProd = app.isPackaged;
const loadURL = isProd ? serve({ directory: join(__dirname, '../out') }) : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  if (isProd) {
    loadURL(win).then(() => {
      win.loadURL('app://-');
    });
  } else {
    win.loadURL('http://localhost:3000');
    // win.webContents.openDevTools();
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
