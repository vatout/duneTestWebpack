import axios from "axios";
import { call, put, select } from "redux-saga/effects";
import { URL } from "./";

//Get all classes of a professor.
export function get_user_classes_api(datas) {

  const datasTosend = new FormData();

  return axios({
    method: 'get',
    url: URL + '/trombi/classes',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: datas.token
    }
  });
}

/**
 * 
 * @param {*} datas 
 */
export function* getUserClasses(datas){

  try{

    const response = yield call(get_user_classes_api, datas);

    if (response.data.status === 200){

      const classes = response.data.response;

      yield put({type: "GET_CLASSES_SUCCESS", classes: classes });

    }else{
    }

  }catch (e) {

  }

}
