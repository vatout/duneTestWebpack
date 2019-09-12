import axios from "axios";
import { call, put, select } from "redux-saga/effects";

//Get all students from a request with filter (from a classe or from all the school)
export function get_all_students_api(datas){

  const datasTosend = new FormData();
  datasTosend.append('idClasse', datas.idClasse);

  datas.search = datas.search == undefined ? '' : datas.search;

  datasTosend.append('search', datas.search);

  var url = datas.idClasse == 0 ? 'https://api.dune-table.com/trombi/' : 'https://api.dune-table.com/trombi/byClasse';

  return axios({
    method: 'post',
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: datas.token
    },
    data: datasTosend
  });
}

//Get all student of a user
export function* get_all_students(datas){
  console.log("GET ALL STUDENTS");

  try{

    const response = yield call(get_all_students_api, datas);

    const content = JSON.stringify(response.data.response);

    if (response.data.status === 200){
      yield put({type: "GET_STUDENTS_SUCCESS", content: content});
    }else{
      yield put({type: "GET_STUDENTS_ERROR"});
    }

  }catch (e) {

    console.log("ERREUR !!!!!! ", e);

  }
}
