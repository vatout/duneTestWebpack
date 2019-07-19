import { call, put } from "redux-saga/effects";
import axios from "axios";

// deleteTocken: fonction demande à l'API de SUPPRIMER un token de connexion
//  action: doit contenir idTable
//  return response promise object
function deleteTocken(action) {
  return axios({
    method: 'POST',
    url: "http://51.38.187.216:9000/api/v1/cnxTable/delToken",
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      'tokenTable': action.token,
    }
  })
}

export function* workerClean(action) {
  try {
    console.log("TOKEN DELETE request ", action.token);
    const response = yield call(deleteTocken, action.token);
    if (response.status !== 200) {
      throw response.status;
    }
    console.log("token delete RESPONSE: ", response);
    yield put({ type: "USER_LOGOUT_CLEAN"});
    yield put({ type: "API_TOKEN_DELETE"});
    yield put({ type: "DELETE_PROF"});

  } catch (error) {
    const message = "Erreur lors de la suppression du token de connection";
    // dispatch a failure action to the store with the error
    yield put({ type: "USER_LOGOUT_ERROR", error, message: message });
  }
}
