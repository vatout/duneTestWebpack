import fs from 'fs';
import RcConfig from './RcConfig';
import axios from 'axios';
import http from 'http';
import https from 'https';
import AdmZip from 'adm-zip';
import rimraf from 'rimraf';

/**
 * download package to a temp path
 * exemple : https://como65416.github.io/DnToolContainer-packages/packages/simple-preview-editor.zip
 * @param  {string} packageUrl
 */
export function downloadPackage(packageUrl) {

  console.log("downloadPackage ", packageUrl);
  var tmpPath = RcConfig.getTempDirectoryPath();
  var tmpSaveFilePath = tmpPath + Buffer.from("dn" + Math.random()).toString('base64') + ".zip";
  var saveFile = fs.createWriteStream(tmpSaveFilePath);

  return new Promise(function(resolve, reject) {
    let httpClient = (packageUrl.indexOf('https://') == 0) ? https : http ;
      httpClient.get(packageUrl, function(response) {
      response.pipe(saveFile);
      saveFile.on('finish', function() {
        saveFile.close(function () {
          resolve(tmpSaveFilePath);
        });
      });
    }).on('error', function(err) {
      fs.unlinkSync(tmpSaveFilePath);
      resolve(err.message);
    })
  });
}

/**
 * install pakcage by file path
 * ex : /home/artyoum/.dn-tool-container/.tmp/ZG4wLjE1MTk1NTE5MjM2MTI3OTI=.zip
 * @param  {string} packageFilePath
 */
export function installPackage(packageFilePath) {
  console.log("installPackage ", packageFilePath);
  return new Promise(function (resolve, reject) {
    let installPackagesPath = RcConfig.getPackageInstallPath();
    let dirName = "pak-" + (new Date().getTime());
    let packageDir = installPackagesPath + dirName;

    var zip = new AdmZip(packageFilePath);
    var zipEntries = zip.getEntries();
    zip.extractAllTo(packageDir, true);

    let manifestPath = packageDir + "/dn-manifest.json";
    if (!fs.existsSync(manifestPath)) {
      reject('dn-manifest.json not found');
      rimraf(packageDir, function () {});
      return;
    } else {
      let mainifestContent = JSON.parse(fs.readFileSync(manifestPath));
      let keyNotExists = ['packageId', 'version', 'packageName', 'iconFile', 'description', 'options'].filter(x => !Object.keys(mainifestContent).includes(x));
      // check dn-manifest.json
      if (keyNotExists.length != 0) {
        reject("dn-manifest.json " + keyNotExists.join(",") + " not write");
        return;
      }
      // check is installed or not
      if (getInstalledPackages().find(pacakgeInfo => pacakgeInfo.packageId == mainifestContent.packageId) != null) {
        reject("this package already installed");
        return;
      }
      // check icon and options file exists or not
      if (!fs.existsSync(packageDir + "/" + mainifestContent.iconFile)) {
        reject('icon not found');
        return;
      }
      for (let option of mainifestContent.options) {
        if (!fs.existsSync(packageDir + "/" + option.file)) {
          reject(option.file + ' not found');
          rimraf(packageDir, function () {});
          return;
        }
      }
    }

    // update packages.json
    let configPath = installPackagesPath + "packages.json";
    let packageDirs = (fs.existsSync(configPath)) ? JSON.parse(fs.readFileSync(configPath)): [];
    packageDirs.push(dirName);
    fs.writeFileSync(configPath, JSON.stringify(packageDirs, null, 4));
    resolve(manifestPath);
  });
}

/**
 * uninstall a exist package
 *
 * @param  {Object} packageId package id
 */
export function uninstallPackage(packageId) {
  return new Promise(function (resolve, reject) {
    let installPackagesPath = RcConfig.getPackageInstallPath();
    let configPath = installPackagesPath + "packages.json";
    let packageDirs = JSON.parse(fs.readFileSync(configPath));
    for (let i in packageDirs) {
      let manifestContent = JSON.parse(fs.readFileSync(installPackagesPath + "/" + packageDirs[i] + "/dn-manifest.json"));
      if (manifestContent.packageId == packageId) {
        let path = packageDirs[i];
        packageDirs.splice(i, 1);
        fs.writeFileSync(configPath, JSON.stringify(packageDirs, null, 4));
        rimraf(path, function () {});
        resolve();
      }
    }
  });
}

/**
 * get all packages info from all package store
 *
 * @return {Object} structure : [
 *    {
 *      packageId: 'package id',
 *      version: 'version',
 *      packageName: 'package name',
 *      iconUrl: 'package icon url',
 *      description: 'package description',
 *      downloadUrl: 'package download url(zip file)'
 *    },
 *    ...
 * ]
 */
export async function getAllStorePackages() {
  let storeUrls = RcConfig.getPackageStoreUrls();
  let packages = [];
  // let config = {headers: {'Content-Type': 'application/json','Cache-Control' : 'no-cache'}};
  // for (let storeUrl of storeUrls) {
  //   let response = await axios.get(storeUrl, config);
  //   packages = packages.concat(response.data);
  // }
  packages = [
    {
      "packageId" : "E7itlmmK4X6d4ZDExE1L1Sx1",
      "version": "1.0.0",
      "packageName" : "Beautifier/Formatter",
      "iconUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/icons/icon001.png",
      "description" : "Some code beautify tool",
      "downloadUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/simple-beautifier-formatter-tool.zip"
    },
    {
      "packageId" : "dfff5e5c63811c27649966b2",
      "version": "1.0.0",
      "packageName" : "Encode/Decode And Encrypt",
      "iconUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/icons/icon002.png",
      "description" : "Some encode, decode and encrypt tool",
      "downloadUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/simple-encode-decode-tool.zip"
    },
    {
      "packageId" : "m1w0yhz3ug32p6leianls8d3",
      "version": "1.0.0",
      "packageName" : "Preview Editor",
      "iconUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/icons/icon003.png",
      "description" : "Some code priview editor",
      "downloadUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/simple-preview-editor.zip"
    },
    {
      "packageId" : "z1weWI81s5FrEiWDtWIM3uM3",
      "version": "1.0.0",
      "packageName" : "Data Converter",
      "iconUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/icons/icon004.png",
      "description" : "Some data convert tool",
      "downloadUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/data-converter.zip"
    },
    {
      "packageId" : "20HKkI4DBf5fY37CqmXP3uM4",
      "version": "1.0.0",
      "packageName" : "CSV TSV",
      "iconUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/icons/icon005.png",
      "description" : "csv tsv tool",
      "downloadUrl" : "https://como65416.github.io/DnToolContainer-packages/packages/csv-tsv-editor.zip"
    }
  ]
  return packages;
}

/**
 * get all installed package information
 * @return {Object} structure : [
 *     {
 *         "packageId": "package id",
 *         "packageName": "package name",
 *         "directory": "package save dirname",
 *         "iconUri": "icon image file uri",
 *         "description": "package description",
 *         "options": [
 *             {
 *                 name: 'option name',
 *                 fileUri: 'html file uri'
 *             },
 *             ...
 *         ]
 *     }
 * ]
 */
export function getInstalledPackages() {
  let installPackagesPath = RcConfig.getPackageInstallPath();

  let configPath = installPackagesPath + "packages.json";
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, '[]');
  }
  let packageDirs = JSON.parse(fs.readFileSync(configPath));
  let installPackageInfos = [];
  for (let packageDir of packageDirs) {
    let content = JSON.parse(fs.readFileSync(installPackagesPath + packageDir + "/dn-manifest.json"));
    content.iconUri = "file://" + installPackagesPath + packageDir + "/" + content.iconFile;
    content.options.map(option => Object.assign(option, {fileUri: "file://" + installPackagesPath + packageDir + "/" + option.file}));
    installPackageInfos.push(content);
  }
  return installPackageInfos;
}
