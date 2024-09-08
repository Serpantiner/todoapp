const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const AutoLaunch = require('auto-launch');

const isDev = process.env.NODE_ENV === 'development';
const dbPath = path.join(app.getPath('userData'), 'tasks.json');

let mainWindow;

const appLauncher = new AutoLaunch({
  name: 'ToDo App',
  path: app.getPath('exe'),
});

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 420,
    y: height - 620,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    minWidth: 400,
    minHeight: 400,
  });

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'build', 'index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();

  appLauncher.isEnabled().then((isEnabled) => {
    if (!isEnabled) appLauncher.enable();
  }).catch((err) => {
    console.error('Auto-launch error:', err);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('minimize-app', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('load-tasks', (event) => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      const tasks = JSON.parse(data);
      event.reply('tasks-loaded', tasks);
    } else {
      event.reply('tasks-loaded', []);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    event.reply('tasks-loaded', []);
  }
});

ipcMain.on('save-tasks', (event, tasks) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
});

ipcMain.on('task-reminder', (event, index) => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    
    const originalPosition = mainWindow.getPosition();
    let shakeCount = 0;
    
    const shake = () => {
      if (shakeCount < 20) {
        const xOffset = Math.floor(Math.random() * 10 - 5);
        const yOffset = Math.floor(Math.random() * 10 - 5);
        mainWindow.setPosition(originalPosition[0] + xOffset, originalPosition[1] + yOffset);
        shakeCount++;
        setTimeout(shake, 100);
      } else {
        mainWindow.setPosition(originalPosition[0], originalPosition[1]);
      }
    };

    shake();
  }
});

ipcMain.on('task-completed', (event, index) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(false);
  }
});