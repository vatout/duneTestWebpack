import { call, put } from "redux-saga/effects";
import initialState from '../reducers/initialState';
import axios from "axios";

function getGamesInstalled(data){
    const url = "http://176.31.252.134:7001/api/v1/table/gestApps/appsOnTable";
    return axios.get(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            token: data.token
        }
    });
}

function getGamesNotInstalled(data){
    const url = "http://176.31.252.134:7001/api/v1/table/gestApps/appsNotOnTable";
    return axios.get(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            token: data.token
        }
    });
}

export function* workerGamesInstalled(data){
  try{
    const response = yield call(getGamesInstalled, data);
      if (response.status === 200) {
        console.log("get_games_installed ", response);
        const installed = response.data.response;
        yield  put({ type: 'GET_GAMES_INSTALLED_SUCCESS', installed: installed});
      }
  }catch (e) {
    yield put({ type: "GET_GAMES_INSTALLED_FAILURE"});
  }
}

export function* workerGamesNotInstalled(data){
  try{
    const response = yield call(getGamesNotInstalled, data);
      if (response.data.status === 200) {
        console.log("get_games_not_installed ", response);
        const available = response.data.response;
        yield  put({ type: 'GET_GAMES_NOT_INSTALLED_SUCCESS', available: available});
      }
  }catch (e) {
    yield put({ type: "GET_GAMES_NOT_INSTALLED_FAILURE"});
  }
}
