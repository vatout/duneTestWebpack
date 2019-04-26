import initialState from './initialState';

import {
  USER_LOGOUT,
  USER_LOGOUT_ERROR,
  USER_LOGOUT_CLEAN
} from '../actions/actionTypes';

export function tokenConnect(state = initialState.tokenSession, action) {
  switch (action.type) {
    case USER_LOGOUT:
      return { ...state, fetching: true, error: null, message: null };
    case USER_LOGOUT_CLEAN:
      return { ...state, fetching: true, tokenSession: null, error: null, message: null };
    case USER_LOGOUT_ERROR:
      return { ...state, fetching: true, error: action.error, message: action.message };

    default:
      return state;
  }
}
