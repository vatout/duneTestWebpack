import { combineReducers } from 'redux';

import { licence } from "./registerLicenceReducer";
import { tokenConnect } from "./tokenConnectReducer";
import { tokenSession } from "./tokenSessionReducer";

import { tokenValidate } from "./tokenValidateReducer";
import { tokenDelete } from "./tokenDeleteReducer";

import { professor } from "./professorReducer";
import { welcome } from "./welcomeReducer";
import { games } from "./gamesReducer";
import { files } from "./filesReducer";
import { loader } from "./loaderReducer";

import storage from "redux-persist/lib/storage";

const reducers = combineReducers({
  licence,
  tokenConnect,
  tokenValidate,
  tokenDelete,
  professor,
  welcome,
  games,
  files,
  loader,
  tokenSession
})

// const rootReducer = (state, action) => {
//   if (action.type === 'USER_LOGOUT') {
//       state = undefined
//   }
//   return reducers(state, action)
// }

// c'est soit au dessus soit au dessous

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    Object.keys(state).forEach(key => {
      storage.removeItem(`persist:${key}`);
    });
    state = undefined;
  }
  return reducers(state, action)
}

export default rootReducer;
