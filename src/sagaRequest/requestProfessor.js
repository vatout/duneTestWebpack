import axios from "axios";
import initialState from '../reducers/initialState';
import { call, put } from "redux-saga/effects";
import { URL } from "./";

function getUserById(data){

    const url = URL + "/users/infos/" + data.idProf;
    return axios.get(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            token: data.token
        }
    });
}

export function* workerProfessorInfo(data){
    try{

        const response = yield call(getUserById, data);

        if (response.data.status === 200) {
            const nom = response.data.response[0].nomUser;
            const prenom = response.data.response[0].prenomUser;
            const email = response.data.response[0].emailUser;
            console.log(nom);
            yield  put({ type: 'GET_PROF_SUCCESS', nom: nom, prenom: prenom, email: email});
        }
    }catch (e) {
        yield put({ type: "GET_PROF_FAILURE"});
    }
}
