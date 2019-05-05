import { call, put } from "redux-saga/effects";
import initialState from '../reducers/initialState';
import axios from "axios";

const { ipcRenderer } = require('electron')

// TODO variable en dur à remplacer par const url = "http://176.31.252.134:7001/files/Games/" + data.id;
// alors ya pas de jeu avec id 2 faudra changer
function createGame(data){
    console.log("createGame", data);
    return axios({
      url: "http://176.31.252.134:7001/api/v1/play/createGame/",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: data.token,
      },
      data: {
        'idClasse': data.idClasse,
        'idGame': data.idGame,
        'idTypeGame': data.idTypeGame,
      }
    });
}


export function* workerEndProcess(data){
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

export function* workerCreateProcess(data){
  try{
    console.log("workerCreateProcess");
    data.idClasse = 1;
    data.idGame = 2;
    data.idTypeGame = 2;
    const response = yield call(createGame, data);
    console.log(response);
    if (response.status === 200) {
       console.log("workerLaunchProcess response", response);
        const playing = response.data;
        yield  put({ type: 'PROCESS_START_SUCCESS', idGP: playing.idGP});
    }
  } catch (e) {
    yield put({ type: "DOWNLOAD_GAME_FAILURE"});
  }
}

export function* workerLaunchProcess(data){
  try{
    console.log("workerLaunchProcess");

//    console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
    console.log("IPC message ping");
    ipcRenderer.send('asynchronous-message', 'ping')

    ipcRenderer.on('pong', (event, arg) => {
      console.log("message received from electron ", arg) // prints "pong"
    });
  } catch (e) {
    yield put({ type: "PROCESS_START_FAILURE", message: response });

  }
}
