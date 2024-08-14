# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and following this [guide](https://medium.com/@azer.maslow/creating-desktop-applications-with-electron-and-react-b7f81f78c9d5)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
React server is hosted in a seperate powershell window.
Electron will start a desktop window with a view of [http://localhost:3000](http://localhost:3000).

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Packages

Uses the [RF-SMART UI](https://medium.com/@azer.maslow/creating-desktop-applications-with-electron-and-react-b7f81f78c9d5) component library which is built on React Aria.

## Tools

Chrome tools can be used to inspect the Electron window, like a normal browser, using Ctrl + Shft + I.

## Electron

### IPC Handlers

Electron exposes several Node APIs to interact with the host machine. To expose them, first create a handler in main.js in the app.whenReady promise fulfilment. Give the handle a name, and a function to callback. Next, register the handler in the preload.js script. Finally, call the event from your main code using the name of the function you exposed in preload.js. See the [IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) tutorial for more information.

## Data Persistance

### MongoDB

[Docker](https://hub.docker.com/_/mongo)

npm run start:mongo
npm run stop:mongo