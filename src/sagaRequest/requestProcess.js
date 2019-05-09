import { call, put, select } from "redux-saga/effects";
import initialState from '../reducers/initialState';
import axios from "axios";

const { ipcRenderer } = require('electron')

function endGame(data){
    console.log("endGame", data);
    return axios({
      url: "http://176.31.252.134:9001/api/v1/play/endGame/",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: data.token,
      },
      data: {
        'idGP': data.idGp,
        'player1': data.players[0][0],
        'player2': data.players[1][0],
        'player3': data.players[2][0],
        'player4': data.players[3][0],
        'scorePlayer1': data.scorePlayer1,
        'scorePlayer2': data.scorePlayer2,
        'scorePlayer3': data.scorePlayer3,
        'scorePlayer4': data.scorePlayer4,
      }
    });
}

// TODO variable en dur à remplacer par const url = "http://176.31.252.134:9001/files/Games/" + data.id;
// alors ya pas de jeu avec id 2 faudra changer
function createGame(data){
    console.log("createGame", data);
    return axios({
      url: "http://176.31.252.134:9001/api/v1/play/createGame/",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: data.token,
      },
      data: {
        'idClasse': data.idClasse,
        'idGame': data.id,
        'idTypeGame': data.idType,
      }
    });
}

export function* workerEndProcess(data){
  try{
    console.log("workerEndProcess");
    console.log(data);
    const getToken = state => state.tokenSession.tokenSession;
    const getPlayers = state => state.process.players;
    data.result.token = yield select(getToken);
    data.result.players = yield select(getPlayers);
    const response = yield call(endGame, data.result);
    console.log("ERROR END PROCESS response ", response);
    if (response.data.status === 200) {
      console.log(response);
      yield  put({ type: 'PROCESS_END_SUCCESS'});
    }
  } catch (e) {
    yield put({ type: "PROCESS_END_FAILURE"});
  }
}

export function* workerCreateProcess(data){
  try{
    console.log("workerCreateProcess", data);
    data.idClasse = 1;
    const response = yield call(createGame, data);
    if (response.status === 200) {
      console.log("workerLaunchProcess response", response);
      yield  put({ type: 'PROCESS_START_SUCCESS', idGP: response.data.idGP, players: data.players, data});
    }
  } catch (e) {
    yield put({ type: "DOWNLOAD_GAME_FAILURE"});
  }
}

export function* workerLaunchProcess(data){
  try{
    console.log("workerLaunchProcess ", data);
    console.log("IPC message ping");
    var message = {
      idGP: data.idGP,
      id: data.data.id,
      players: data.players
    }
    console.log(message);
    ipcRenderer.send('asynchronous-message', message)
    yield put({type: 'LOADER_START'});

  } catch (e) {
    yield put({ type: "PROCESS_START_FAILURE", message: "error" });

  }
}
