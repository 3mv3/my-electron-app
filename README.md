# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and following this [guide](https://medium.com/@azer.maslow/creating-desktop-applications-with-electron-and-react-b7f81f78c9d5)

# To Begin
### `npm install`
Installs the node packages required to build and run the application.

### `npm run start:mongo`
Runs the docker compose files to stand up a mongodb instance and mongo express. Required for the app to connect to a database.
Also bootstraps the database with initial data.

### `npm run dev`
Runs the app in the development mode.\
React server is hosted in a seperate powershell window.
Electron will start a desktop window with a view of [http://localhost:3000](http://localhost:3000).

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Tools

Chrome tools can be used to inspect the Electron window, like a normal browser, using Ctrl + Shft + I.

## Electron

### IPC Handlers

Electron exposes several Node APIs to interact with the host machine. To expose them, first create a handler in main.js in the app.whenReady promise fulfilment. Give the handle a name, and a function to callback. Next, register the handler in the preload.js script. Finally, call the event from your main code using the name of the function you exposed in preload.js. See the [IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) tutorial for more information or [this](https://whoisryosuke.com/blog/2022/using-nodejs-apis-in-electron-with-react) tutorial here.

Preloads.js is like an interface where you declare methods to be exposed to the client i.e
    queryDb: (db, collection, query) => ipcRenderer.invoke('queryDb', db, collection, query)

These then need to be handled in main.js, once the app is ready, i.e
    ipcMain.handle('queryDb', (event, db, col, q) => queryDb(db, col, q))

The methods can then be consumed in the client
    await window.electron.queryDb<ITab>('onboarding', 'tabs', {})