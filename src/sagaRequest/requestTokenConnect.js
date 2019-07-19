import { call, put } from "redux-saga/effects";
import axios from "axios";

// fetchTocken: fonction demande à l'API de générer un token de connexion
//  action: doit contenir idTable
//  return response promise object
function fetchTocken(action) {
  return axios({
    method: 'POST',
    url: "http://51.38.187.216:9000/api/v1/cnxTable/genToken",
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      'idTable': action.idTable,
    }
  })
}

// fetchTockenValidate: fonction demande à l'API si l'utilisateur a validé le token de connexion
//  action: doit contenir le tokenTable à vérifier
//  return response promise object
function fetchTockenValidate(action) {
  return axios({
    method: 'POST',
    url: "http://51.38.187.216:9000/api/v1/cnxTable/verifToken",
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      'tokenTable': action.tokenConnect,
    }
  })
}

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
      'tokenTable': action.tokenConnect,
    }
  })
}

// workerTockenCreate: fonction demande de générer le token de connexion
//  trigger: API_TOKEN_SUCCESS / API_TOKEN_FAILURE
export function* workerTokenCreate(action) {
  let tokenConnect = "";
  try {
    action.idTable = 1;
    const response = yield call(fetchTocken, action);
    if (response.status !== 200) {
      throw response.status
    }
    tokenConnect = response.data.tokenTable;
    console.log("reponse tokenCreate: ", response);
    console.log("reponse tokenConnect: ", tokenConnect);
    // dispatch a success action to the store with the new token
    yield put({ type: "API_TOKEN_SUCCESS", tokenConnect: tokenConnect });
  } catch (error) {
    let message = "";
    if (error === 500) {
      message = "Something went wrong with the connection the wizards are upset";
    }
    yield put({ type: "API_TOKEN_FAILURE", error: error, message: message });
  }
}

export function* workerTokenDelete(action) {
  try {
    console.log("TOKEN DELETE request ", action.tokenConnect);
    const response = yield call(deleteTocken, action.tokenConnect);
    if (response.status !== 200) {
      throw response.status;
    }
    console.log("token delete RESPONSE: ", response);
    // dispatch a success action to the store with the new token
    yield put({ type: "API_TOKEN_DELETED"});

  } catch (error) {
    const message = "Erreur lors de la suppression du token de connection";
    // dispatch a failure action to the store with the error
    yield put({ type: "API_TOKEN_DELETE_FAILURE", error, message: message });
  }
}

export function* workerTokenValidate(action) {
  let professorId = [];
  let tokenSession = [];
  try {
    console.log("table token create", action.tokenConnect);
    const response = yield call(fetchTockenValidate, action);
    if (response.status !== 200) {
      throw response.status;
    }
    professorId = response.data.idProf;
    tokenSession = response.data.token;
    console.log("token validate response :", response);
    console.log(professorId);
    console.log(tokenSession);
    // dispatch a success action to the store with the new token
    yield put({ type: "API_PROF_ID", professorId });
    yield put({ type: "API_TOKEN_SESSION", tokenSession });
    yield put({ type: "GET_PROF_REQUEST", professorId });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: "API_TOKEN_VALIDATE_FAILURE", error });
  }
}
