import { call, put } from "redux-saga/effects";
import initialState from '../reducers/initialState';
import RcConfig from '../utils/download/RcConfig';
import axios from "axios";
import FileSaver from 'file-saver';
import AdmZip from 'adm-zip';

// TODO variable en dur à remplacer par const url = "http://176.31.252.134:7001/files/Games/" + data.id;
// alors ya pas de jeu avec id 2 faudra changer
function getGame(data){
    console.log("getGame", data);
    return axios({
      url: "http://176.31.252.134:7001/files/Games/1",
      method: 'GET',
      responseType: 'blob',
      headers: {
        token: data.token,
      }
    });
}

export function installPackage(packageFilePath) {
  console.log("installPackage ", packageFilePath);
  return new Promise(function (resolve, reject) {
    let installPackagesPath = RcConfig.getPackageInstallPath();
    let dirName = "pak-" + (new Date().getTime());
    let packageDir = installPackagesPath + dirName;
    console.log("packageDir ", packageDir);
    var zip = new AdmZip(packageFilePath);
    console.log("zip", zip);
    var zipEntries = zip.getEntries();
    console.log("bordel");
    zip.extractAllTo(packageDir, true);
    console.log(zipEntries);
  });
}

export function* workerInstallationGame(data){
  try{
    console.log("workerInstallGame");
    console.log(data);
//    const response = yield call(installPackage, data.path);
      // if (response.data.status === 200) {
      //     const resultsNot = response.data.response;
      //     yield  put({ type: 'INSTALLATION_GAME_SUCCESS'});
      // }
  } catch (e) {
    yield put({ type: "INSTALLATION_GAME_FAILURE"});
  }
}

export function* workerDownloadGame(data){
  try{
    console.log("workerDownloadGame");
    const response = yield call(getGame,data);
    console.log(response);
    if (response.status === 200) {
      var tmpPath = RcConfig.getStoragePath();
      var fileName = "duneGame" + data.id + ".zip";
      var tmpSaveFilePath = tmpPath + fileName;
      const answer = window.URL.createObjectURL(new Blob([response.data]));
      console.log("answer ", answer);
      console.log("path ", tmpPath);
      const tmp = FileSaver.saveAs(response.data, fileName);

      console.log("workerDownloadGame response", response);
      const path = response.data.response;
      yield  put({ type: 'INSTALLATION_GAME', path: tmpSaveFilePath});
    }
  } catch (e) {
    yield put({ type: "DOWNLOAD_GAME_FAILURE"});

  }
}
