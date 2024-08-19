// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const path = require('node:path')
const { MongoClient } = require('mongodb');
const { execSync } = require('child_process')

require('dotenv').config()

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    return filePaths[0]
  }
}

const DB_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const DB_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
const DB_HOST = process.env.DATABASE_HOST;
const DB_PORT = process.env.DATABASE_PORT;

const client = new MongoClient(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`);

async function queryDb (db, collection, query) {
  
  console.log(`Pinged ${db} => ${collection} => ${JSON.stringify(query)}`);

  let res = await client.db(db).collection(collection).find(query).toArray();

  console.log('Finished query ' + JSON.stringify(res))
  
  return res;
}

async function insertOneDb (db, collection, query, data) {

  // strip id to avoid immutability issues
  const { _id, ...rest } = data;
  const update = { $set: { ...rest }};
  const options = { upsert: true };

  console.log('Upsering ' + JSON.stringify(query))
  console.log('Data: ' + JSON.stringify(update))
  
  let res = await client.db(db).collection(collection).updateOne(query, update, options);

  console.log('Finished upserting ' + JSON.stringify(res))
}

const createWindow = () => {
  // Create the browser window

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js')
    },
  })

  const startURL = !app.isPackaged
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return mainWindow
}

function showNewWindow(url) {
  /// https://www.electronjs.org/docs/latest/api/browser-window
  const child = new BrowserWindow({ parent: main, modal: true, show: false, 
    // frame: false,
    // titleBarStyle: 'hidden',
    // transparent: true,
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
    minWidth: 400,
    width: 400,
    maxWidth: 400,
    minHeight: 300, 
    height: 300,
    maxHeight: 300 })

  child.loadURL(url)
  child.once('ready-to-show', () => {
    child.show()
  })
}

function exec(args) {
  console.log("running cli");
  
  return execSync(args).toString();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('queryDb', (_, db, col, q) => queryDb(db, col, q))
  ipcMain.handle('insertOneDb', (_, db, col, query, data) => insertOneDb(db, col, query, data))
  ipcMain.handle('launchModal', (_, url) => showNewWindow(url))
  ipcMain.handle("node:version", async (_) => exec("node -v"));

  // Connect the client to the server (optional starting in v4.7)
  await client.connect();

  let main = createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  await client.close()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})