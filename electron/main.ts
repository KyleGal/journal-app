const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow: any = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
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

// IPC handlers for journal storage
const userDataPath = app.getPath('userData');
const journalDataPath = path.join(userDataPath, 'journal-data.json');

// Ensure data file exists
if (!fs.existsSync(journalDataPath)) {
  fs.writeFileSync(journalDataPath, JSON.stringify({ entries: [] }));
}

ipcMain.handle('get-entries', async () => {
  try {
    const data = fs.readFileSync(journalDataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading entries:', error);
    return { entries: [] };
  }
});

ipcMain.handle('save-entry', async (_event: any, entry: any) => {
  try {
    const data = JSON.parse(fs.readFileSync(journalDataPath, 'utf-8'));
    const existingIndex = data.entries.findIndex((e: any) => e.id === entry.id);

    if (existingIndex >= 0) {
      data.entries[existingIndex] = entry;
    } else {
      data.entries.push(entry);
    }

    fs.writeFileSync(journalDataPath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving entry:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('delete-entry', async (_event: any, entryId: string) => {
  try {
    const data = JSON.parse(fs.readFileSync(journalDataPath, 'utf-8'));
    data.entries = data.entries.filter((e: any) => e.id !== entryId);
    fs.writeFileSync(journalDataPath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error deleting entry:', error);
    return { success: false, error: String(error) };
  }
});
