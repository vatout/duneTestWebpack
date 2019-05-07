const fs = require('fs')
const zipUtil = require('adm-zip')
// module.exports = {
// };

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

exports.installPackage = function(packageFilePath) {
  console.log("installPackage ", packageFilePath);
  return new Promise(function (resolve, reject) {
    let installPackagesPath = getPackageInstallPath();
    let dirName = "pak-" + (new Date().getTime());
    let packageDir = installPackagesPath + dirName;

    var zip = new zipUtil(packageFilePath);
    var zipEntries = zip.getEntries();
    zip.extractAllTo(packageDir, true);
    console.log("extracted ", packageDir)
    packageDir += "/DuneTestGame"

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
    childProcess = exec('yarn --cwd /home/artyoum/.DuneGames/installed_packages/DuneTestGame/', (err, stdout, stderr) => {
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


exports.writeResult = function(message) {
  let installPackagesPath = getPackageInstallPath();
  let configPath = installPackagesPath + "results.json";

  console.log("configPath", configPath)
  let packageDirs = (fs.existsSync(configPath)) ? JSON.parse(fs.readFileSync(configPath)): [];
  var tmp = message.split('-');
  var result = {
    idGp: tmp[0],
    token: tmp[1]
  }
  console.log(result);
  packageDirs.push(result);
  fs.writeFileSync(configPath, JSON.stringify(packageDirs, null, 4));
}
