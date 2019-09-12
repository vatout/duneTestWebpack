import { call, put } from "redux-saga/effects";
import initialState from '../reducers/initialState';
import axios from "axios";

function getFiles(datas){

    const datasTosend = new FormData();

    datasTosend.append('private', datas.filesPrivate === true ? 1 : 0);
    datasTosend.append('title', datas.title);
    datasTosend.append('type', datas.typeF);
    datasTosend.append('classement', datas.classement);

    return axios({
        method: 'post',
        url: 'https://api.dune-table.com/filesManager/getAll',
        headers: {
            token: datas.token
        },
        data: datasTosend
    });

}

export function* workerFiles(data){
  try{
      yield  put({ type: 'LOADER_START'});
    const response = yield call(getFiles, data);
      if (response.status === 200) {
            const results = response.data.response;
          yield  put({ type: 'GET_FILES_SUCCESS', results: results});
          yield  put({ type: 'LOADER_END'});
      }
  }catch (e) {
    yield put({ type: "GET_FILES_FAILURE"});
  }
}
