import React from 'react'
import ReactDOM from "react-dom";
import App from "./components/App";

const { ipcRenderer } = require('electron')

import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import rootReducer from "./reducers/index.js";

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistStore, persistReducer } from 'redux-persist';

import { watcherSaga } from "./sagaRequest/request";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['professor', 'tokenConnect', 'welcome', 'licence', 'tokenValidate', 'tokenSession']
};
const pReducer = persistReducer(persistConfig, rootReducer);

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// dev tools middleware
const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

let store = createStore(
    pReducer,
//    compose(applyMiddleware(sagaMiddleware)));
compose(applyMiddleware(sagaMiddleware), reduxDevTools));

const persistor = persistStore(store);
// run the saga
sagaMiddleware.run(watcherSaga);

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root)

// Now we can render our application into it

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

ipcRenderer.on('pong', (event, arg) => {
  console.log("message received from electron ", arg);
  var tmp = arg.split('-');
  var result = {
    idGp: tmp[0],
    scorePlayer1: tmp[1],
    scorePlayer2: tmp[2],
    scorePlayer3: tmp[3],
    scorePlayer4: tmp[4],
  }
  store.dispatch({ type: "PROCESS_END", result });
  store.dispatch({ type: "LOADER_END"})
});

ipcRenderer.on('downloadGood', (event, arg) => {
  console.log("download Good ", arg);
  console.log("store", store);
  var tmp = arg.split('-');
  var result = {
    idGp: tmp[0],
    token: tmp[1]
  }
  store.dispatch({ type: "UPDATE_GAMELIST", result });
  store.dispatch({ type: "LOADER_END"})
});
