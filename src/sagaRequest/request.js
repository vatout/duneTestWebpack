import { takeLatest } from "redux-saga/effects";

import { workerLicence, workerLicenceRegister } from "./requestLicence";
import { workerTokenCreate, workerTokenDelete, workerTokenValidate } from "./requestTokenConnect";
import { workerProfessorInfo } from "./requestProfessor";
import { workerFiles } from "./requestFiles";
import { workerGamesInstalled, workerGamesNotInstalled, workerUpdateGameList, workerRefreshGames } from "./requestGames";
import { workerDownloadGame, workerInstallationGame } from "./requestDownloadGame";
import { workerCreateProcess, workerLaunchProcess, workerEndProcess } from "./requestProcess";
import { workerClean } from "./requestClean";

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherSaga() {
  yield takeLatest("API_LICENCE_REQUEST", workerLicence);
  yield takeLatest("API_LICENCE_SUCCESS", workerLicenceRegister);

  yield takeLatest("API_TOKEN_REQUEST", workerTokenCreate);
  yield takeLatest("API_TOKEN_DELETE", workerTokenDelete);
  yield takeLatest("API_TOKEN_VALIDATE", workerTokenValidate);

  yield takeLatest("GET_GAMES_INSTALLED", workerGamesInstalled);
  yield takeLatest("GET_GAMES_NOT_INSTALLED", workerGamesNotInstalled);

  yield takeLatest("GET_FILES", workerFiles);

  yield takeLatest("GET_PROF_REQUEST", workerProfessorInfo);
  yield takeLatest("USER_LOGOUT", workerClean);

  yield takeLatest("DOWNLOAD_GAME", workerDownloadGame);
  yield takeLatest("INSTALLATION_GAME", workerInstallationGame);

  yield takeLatest("PROCESS_START", workerCreateProcess);
  yield takeLatest("PROCESS_START_SUCCESS", workerLaunchProcess);
  yield takeLatest("PROCESS_END", workerEndProcess);
  yield takeLatest("UPDATE_GAMELIST", workerUpdateGameList);
  yield takeLatest("REFRESH_GAMES", workerRefreshGames);

}
