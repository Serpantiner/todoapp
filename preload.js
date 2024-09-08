const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadTasks: () => ipcRenderer.send('load-tasks'),
  onTasksLoaded: (callback) => ipcRenderer.on('tasks-loaded', (_, tasks) => callback(tasks)),
  saveTasks: (tasks) => ipcRenderer.send('save-tasks', tasks),
  sendTaskReminder: (index) => ipcRenderer.send('task-reminder', index),
  sendTaskCompleted: (index) => ipcRenderer.send('task-completed', index),
  closeApp: () => ipcRenderer.send('close-app'),
  minimizeApp: () => ipcRenderer.send('minimize-app')
});