import { call, put, select } from "redux-saga/effects";
import initialState from '../reducers/initialState';
import axios from "axios";

function updateGameList(data){
    console.log("update game list", data);
    return axios({
      url: "http://176.31.252.134:9001/api/v1/table/gestApps/appInstalled",
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: data.token,
      },
      data: {
        'idJeu': data.result.idGp,
      }
    });
}

function getGamesInstalled(data){
  const datasTosend = new FormData();
  datasTosend.append('nom', data.nom);
  const url = "http://176.31.252.134:9001/api/v1/table/gestApps/appsOnTable";
  return axios({
    method: 'post',
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: data.token
    },
    data: datasTosend
  });
}

function getGamesNotInstalled(data){
  const datasTosend = new FormData();
  datasTosend.append('nom', data.nom);
    const url = "http://176.31.252.134:9001/api/v1/table/gestApps/appsNotOnTable";
    return axios({
    method: 'post',
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: data.token
    },
    data: datasTosend
  });
}

export function* workerGamesInstalled(data){
  try{
    yield  put({ type: 'LOADER_START'});
    const response = yield call(getGamesInstalled, data);
      if (response.status === 200) {
        const installed = response.data.response;
        console.log("INSTALLED Games: ", installed);
        yield  put({ type: 'GET_GAMES_INSTALLED_SUCCESS', installed: installed});
        yield  put({ type: 'LOADER_END'});
      }
  }catch (e) {
    yield put({ type: "GET_GAMES_INSTALLED_FAILURE"});
    yield  put({ type: 'LOADER_END'});
  }
}

export function* workerGamesNotInstalled(data){
  try{
    yield  put({ type: 'LOADER_START'});
    const response = yield call(getGamesNotInstalled, data);
      if (response.data.status === 200) {
        const available = response.data.response;
        console.log("NOTINSTALLED Games: ", available);
        yield  put({ type: 'GET_GAMES_NOT_INSTALLED_SUCCESS', available: available});
        yield  put({ type: 'LOADER_END'});
      }
  }catch (e) {
    yield put({ type: "GET_GAMES_NOT_INSTALLED_FAILURE"});
    yield  put({ type: 'LOADER_END'});
  }
}

export function* workerUpdateGameList(data){
  try{
    console.log("workerUpdateGameList");
    yield  put({ type: 'LOADER_START'});
    const getToken = state => state.tokenSession.tokenSession;
    data.token = yield select(getToken);
    console.log(data);
    const response = yield call(updateGameList, data);
    console.log(response);
      if (response.data.status === 200) {
        const available = response.data.response;
        console.log("UPDATE Games: ", response);
        yield  put({ type: 'UPDATE_GAMELIST_SUCCESS'});
        yield  put({ type: 'LOADER_END'});
      }
  }catch (e) {
    yield put({ type: "UPDATE_GAMELIST_FAILURE"});
    yield  put({ type: 'LOADER_END'});
  }
}

export function* workerRefreshGames(data){
  try{
    yield  put({ type: 'LOADER_START'});
    yield put({ type: 'GET_GAMES_INSTALLED'});
    yield put({ type: 'GET_GAMES_NOT_INSTALLED'});
  }catch (e) {
    yield  put({ type: 'LOADER_END'});
  }
}

workerRefreshGames
