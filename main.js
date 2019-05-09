'use strict'

// Import parts of electron to use
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const cp = require('child_process');
const psTree = require('ps-tree');
const install = require('./src/utils/install')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let gameWindow;
let childProcess;
let idGp;
let idGame;
let results;
let token;

// licence = TZDM-XT23-TAX5-4YNL

// Keep a reference for dev mode
let dev = false

if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function play() {
  return new Promise(function (resolve, reject) {
    console.log("exec yarn start");
    var path = install.getPackageInstallPath();
    path = path + "duneGame"+ idGame+".zip";
    console.log("PATH", path)
    childProcess = cp.exec('yarn --cwd ' + path + ' start', (err, stdout, stderr) => {
      // if (err) {
      //   // node couldn't execute the command
      //   return;
      // }

      // the *entire* stdout and stderr (buffered)
      console.log('stdout', stdout);
      console.log(`stderr: ${stderr}`);
    });

  })
}


function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1624,
    height: 968,
    show: false,
    //frame: false,
    //fullscreen: true,
    backgroundColor: '#FEEFC2',
    webPreferences: {
      nodeIntegration: true
    }
  })
  gameWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
  //  frame: false,
  //  fullscreen: true,
    backgroundColor: '#FEEFC2',
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    let homePath = global.process.env.HOME || global.process.env.USERPROFILE;
    let storagePath = homePath + "/.DuneGames/";
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath);
    }
    let fileName = item.getFilename();
    let fullPath = storagePath + fileName;
  // Set the save path, making Electron not to prompt a save dialog.
  item.setSavePath(fullPath)
  console.log("bon ", fullPath);
  console.log("le nom ", fileName);
  item.on('updated', (event, state) => {
    if (state === 'interrupted') {
      console.log('Download is interrupted but can be resumed')
    } else if (state === 'progressing') {
      if (item.isPaused()) {
        console.log('Download is paused')
      } else {
        console.log(`Received bytes: ${item.getReceivedBytes()}`)
      }
    }
  })
  item.once('done', (event, state) => {
    if (state === 'completed') {
      console.log('Download successfully');
      console.log(install);
      install.installPackage(fullPath, fileName);
      var myString = fileName.replace(/\D/g,'');
      myString = myString + '-' + token;
      console.log("sending mystring downloadGood ", myString);
      mainWindow.webContents.send('downloadGood', myString);
    } else {
      mainWindow.webContents.send('download', "Une erreure est survenue pendant le téléchargement, veuillez recommencer s'il vous plait");
      console.log(`Download failed: ${state}`)
    }
  })
})

  // and load the index.html of the app.
  let indexPath
  let gamePath

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }
  gamePath = url.format({
    protocol: 'http:',
    host: 'localhost:3000',
    pathname: 'index.html',
    slashes: true
  })

  mainWindow.loadURL(indexPath)
//  gameWindow.loadURL('http://localhost:3000');
  //ajout de reduxDevTools
  // https://electronjs.org/docs/tutorial/devtools-extension
  // const os = require('os')
  //
  // BrowserWindow.addDevToolsExtension(
  //   path.join(os.homedir(), '/.config/google-chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
  // )

  // IPC test
  const { ipcMain } = require('electron')
  ipcMain.on('asynchronous-message', async (event, arg) => {
    console.log("message in electron from react on game launch ", arg) // prints "ping"
    var tmp = arg.split('-');
    idGp = tmp[0];
    idGame = tmp[1];
    var ret = play();
    setTimeout(function(){
      gameWindow.loadURL('http://localhost:3000');
      gameWindow.reload();
    }, 5000);
    gameWindow.show();
    event.sender.send('asynchronous-reply', 'dataTreated')
  })

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    gameWindow.hide();
    // Open the DevTools automatically if developing
    if (dev) {
      mainWindow.webContents.openDevTools()
    }
  })

  gameWindow.once('ready-to-show', () => {
    // if (childProcess != undefined) {
    //   gameWindow.show();
    // }
    // Open the DevTools automatically if developing
    if (dev) {
      gameWindow.webContents.openDevTools()
    }
  })

  ipcMain.on('gameEndMessage', async (event, arg) => {
    console.log(arg) // prints "ping"
    console.log("sending message");
    results = idGp + '-' + arg;
    console.log("RESULTS ", results);
    mainWindow.webContents.send('pong', results);
    event.sender.send('gameMessage', 'dataTreated');
    gameWindow.close();
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    gameWindow = null
    mainWindow = null
  })

  gameWindow.on('close', (e) => {
    console.log("fenetre sera fermee");
    e.preventDefault();
    gameWindow.hide();
    results = idGp + '-' + "5-5-5-5";
    console.log("RESULTS ", results);
    mainWindow.webContents.send('pong', results);

    if (childProcess != undefined) {
      psTree(childProcess.pid, function (err, children) {
        cp.spawn('kill', ['-9'].concat(children.map(function (p) { return p.PID })));
      });
    }
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
  })
  gameWindow.on('closed', function() {
    console.log("fenetre fermee");
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    gameWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
