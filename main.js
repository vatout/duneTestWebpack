'use strict'

// Import parts of electron to use
// import initIpcListeners from "./ipcMain/listeners";

const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const cp = require('child_process');
const psTree = require('ps-tree');
const install = require('./src/electron/install')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let gameWindow;
let childProcess;
let idGp;
let idGame;
let players;
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
  if (idGame === "9999") {
    gameWindow.loadURL(`https://zaangetsuu.github.io/ProtoDune1/`);
    gameWindow.webContents.send('studentList', players);
    gameWindow.show();
  } else {
    console.log("function play");
    var spawn = require('child_process').spawn;
    let path = install.getPackageInstallPath();
    path = path + "duneGame"+ idGame+".zip";
    console.log("PATH", path);
    // var cmd = 'yarn --cwd ' + path + ' start';
    childProcess = spawn('yarn', ['start'], { cwd: path});
    childProcess.stdout.on('data', function (data) {
      var log = data.toString();
      console.log('stdout: ' + log);
      if (log.includes("Compiled")) {     
        gameWindow.loadURL('http://localhost:3000');
        gameWindow.webContents.send('studentList', players);
        gameWindow.show();
      }
      
    });
    console.log(childProcess);
    childProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString());
    });
  }


  
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
    let homePath = app.getPath("downloads");
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
    idGp = arg.idGP;
    idGame = arg.id
    players = arg.players;
    var ret = play();
    // setTimeout(function(){
    //   gameWindow.loadURL('http://localhost:3000');
    //   gameWindow.show();
    // }, 5000);
    event.sender.send('asynchronous-reply', 'dataTreated')
  })

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    gameWindow.loadURL(`file://${__dirname}/games/WebGL/index.html`);
    //gameWindow.show();
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
    results = {
      idGp: idGp,
      playerScore: arg
    }
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

// On app activation (e.g. when clicking dock icon), re-create BrowserWindow if necessary
// app.on(
// 	"activate",
// 	async () => {
// 		if (!getWindow()) {
// 			setWindow(await createWindow());
// 		}
// 	},
// );

// (async () => {
// 	// Wait for Electron to be initialized
// 	await app.whenReady();

// 	// Set up translations, messaging between main and renderer processes, and application menu
// 	initI18n();
// 	buildMenu();
// 	initIpcListeners();

// 	// Create and show BrowserWindow
// 	setWindow(await createWindow());

// 	updateApp();
// })();