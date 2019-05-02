'use strict'

// Import parts of electron to use
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const zipUtil = require('adm-zip')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let gameWindow;

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

/**
 * get storage path
 *
 * @return {string}
 */
function getStoragePath() {
  let homePath = global.process.env.HOME || global.process.env.USERPROFILE;
  let storagePath = homePath + "/.DuneGames/";
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath);
  }
  return storagePath;
}

/**
 * get package install directory path
 *
 * @return {string}
 */
function getPackageInstallPath() {
  let storagePath = getStoragePath();
  let installPackagesPath = storagePath + "installed_packages/";
  if (!fs.existsSync(installPackagesPath)) {
    fs.mkdirSync(installPackagesPath);
  }
  return installPackagesPath;
}

function getInstalledPackages() {
  let installPackagesPath = getPackageInstallPath();

  let configPath = installPackagesPath + "packages.json";
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, '[]');
  }
  let packageDirs = JSON.parse(fs.readFileSync(configPath));
  let installPackageInfos = [];
  // for (let packageDir of packageDirs) {
  //   let content = JSON.parse(fs.readFileSync(installPackagesPath + packageDir + "/dn-manifest.json"));
  //   content.iconUri = "file://" + installPackagesPath + packageDir + "/" + content.iconFile;
  //   content.options.map(option => Object.assign(option, {fileUri: "file://" + installPackagesPath + packageDir + "/" + option.file}));
  //   installPackageInfos.push(content);
  // }
  return installPackageInfos;
}

function installPackage(packageFilePath) {
  console.log("installPackage ", packageFilePath);
  return new Promise(function (resolve, reject) {
    let installPackagesPath = getPackageInstallPath();
    let dirName = "pak-" + (new Date().getTime());
    let packageDir = installPackagesPath + dirName;

    var zip = new zipUtil(packageFilePath);
    var zipEntries = zip.getEntries();
    zip.extractAllTo(packageDir, true);
    packageDir += "/DuneTestGame"
    console.log("extracted ", packageDir)

    // On mettra ça quand on aura tout le temps un duneConfig.json
    //let manifestPath = packageDir + "/duneConfig.json";
    let manifestPath = "/home/artyoum/.DuneGames/installed_packages/DuneTestGame/duneConfig.json";

    if (!fs.existsSync(manifestPath)) {
      reject('duneConfig.json not found');
      rimraf(packageDir, function () {});
      return;
    } else {
      console.log("Reading the duneConfig ");
      let mainifestContent = JSON.parse(fs.readFileSync(manifestPath));
      console.log("manifests ", manifestPath);
      console.log("menifest content ", mainifestContent);
      let keyNotExists = ['packageId', 'version', 'packageName', 'iconFile', 'description', 'options'].filter(x => !Object.keys(mainifestContent).includes(x));
      // check duneConfig.json
      if (keyNotExists.length != 0) {
        reject("duneConfig.json " + keyNotExists.join(",") + " not write");
        return;
      }
      // check is installed or not
      if (getInstalledPackages().find(pacakgeInfo => pacakgeInfo.packageId == mainifestContent.packageId) != null) {
        reject("this package already installed");
        return;
      }
      // check icon and options file exists or not
      // if (!fs.existsSync(packageDir + "/" + mainifestContent.iconFile)) {
      //   reject('icon not found');
      //   return;
      // }
      // for (let option of mainifestContent.options) {
      //   if (!fs.existsSync(packageDir + "/" + option.file)) {
      //     reject(option.file + ' not found');
      //     rimraf(packageDir, function () {});
      //     return;
      //   }
      // }
    }

    // update packages.json
    let configPath = installPackagesPath + "packages.json";
    console.log("configPath", configPath)
    let packageDirs = (fs.existsSync(configPath)) ? JSON.parse(fs.readFileSync(configPath)): [];
    packageDirs.push(dirName);
    fs.writeFileSync(configPath, JSON.stringify(packageDirs, null, 4));
    resolve(manifestPath);
  }).then((response) => {
    console.log("exec yarn install");
    const { exec } = require('child_process');
    exec('yarn --cwd /home/artyoum/.DuneGames/installed_packages/DuneTestGame/', (err, stdout, stderr) => {
      // if (err) {
      //   // node couldn't execute the command
      //   return;
      // }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }).then((response) => {
    console.log("exec yarn start");
    const { exec } = require('child_process');
    exec('yarn --cwd /home/artyoum/.DuneGames/installed_packages/DuneTestGame/ start', (err, stdout, stderr) => {
      // if (err) {
      //   // node couldn't execute the command
      //   return;
      // }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  });
}



function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1624,
    height: 968,
    show: false,
    backgroundColor: '#FEEFC2',
    webPreferences: {
      nodeIntegration: true
    }
  })
  gameWindow = new BrowserWindow({
    width: 1624,
    height: 968,
    show: false,
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
      installPackage(fullPath);
    } else {
      console.log(`Download failed: ${state}`)
    }
  })
})

  // and load the index.html of the app.
  let indexPath

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

  mainWindow.loadURL(indexPath)

  //ajout de reduxDevTools
  // https://electronjs.org/docs/tutorial/devtools-extension
  const os = require('os')

  BrowserWindow.addDevToolsExtension(
    path.join(os.homedir(), '/.config/google-chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
  )

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
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
