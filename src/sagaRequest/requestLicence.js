import { call, put } from "redux-saga/effects";
import axios from "axios";

// checkStorage: fonction check ds localStorage si licence est présent
// return: numéro de licence ou null
function checkStorage() {
  let licence = [];
  if ((licence = localStorage.getItem("licence")) === null) {
    console.log("CHECKSTORAGE licence = NULL : ", licence);
    return null;
  } else {
    console.log("CHECKSTORAGE licence : ", licence);
    return licence;
  }
}

// fetchTokenRequest: fonction execute la requete
//  dev: port 9001
//  prod: port 9001
//  return: response promise object
function fetchIdTable(action) {
  console.log("fetchTokenRequest ", action);
  return axios({
    method: 'POST',
    url: "http://176.31.252.134:9001/api/v1/cnxTable/install",
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      nom: action.name,
      licence: action.licence,
    }
  })
}

// workerLicence : on envoie la licence et le nom pour récupérer le tokenRequete
//  success : on enregistre la licence et le tokenRequete dans le localStorage
//  failure : on ecris yield error
export function* workerLicence(action) {
  let register = {};
  console.log("WORKER LICENCE " + action.name + " " + action.licence);
  try {
    let licence = checkStorage();
    if (licence === null) {
      const response = yield call(fetchIdTable, action);
      register = response.data;
      register.prev = action;
      // TODO supprimer lorsque l'API renvera un idTable
      register.idTable = 1;
      console.log("WORKER LICENCE trying\nname: " + register.prev.name + "\nlicence: " + register.prev.licence+ "\nresponse: ", register);
      if (response.data.status === 200) {
        console.log("response --- ", response );
        yield put({ type: "API_LICENCE_SUCCESS", register: register });
        console.log("WORKER LICENCE PUT and action\nname: " + register.prev.name + "\nlicence: " + register.prev.licence+ "\nresponse: ", register);
      } else {
        return null;
      }
    } else {
      yield put({ type: "API_LICENCE_FAILURE", error: "error" });
    }
  } catch (error) {
    console.log("ERROR WORKER LICENCE ", register);
    const message = "Une erreur est survenue lors de l'enregistrement de votre licence, impossible de trouver cette dernire, veuillez vérifier votre saisie"
    yield put({ type: "API_LICENCE_FAILURE", error: error, message: message });
  }
}

// workerLicenceRegister : enregistrement dans le local storage du navigateur
//  dans licence et token, passé dans le state sous licence et tokenAuthReducer
//  success : token est dispo pour faire des requetes sur API et licence est enregistré dans localStorage
//  failure : écrit un message d'erreur dans message et set error à true
export function* workerLicenceRegister(action) {
  console.log("WORKER LICENCE REGISTER \n" + action.register.prev.name + "\nlicence: " + action.register.prev.licence + "\ntoken: " + action.register.token);
  try {
    localStorage.setItem("licence", JSON.stringify(action.register.prev.licence));
    localStorage.setItem("idTable", JSON.stringify(action.register.idTable));
  } catch (error) {
    console.log("ERROR licence :" + action.register.prev.licence + "\ntoken: "+ action.register.token);
    yield put({ type: "API_LICENCE_FAILURE", error });
  }
}
