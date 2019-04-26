import initialState from './initialState';

import {
  API_TOKEN_REQUEST,
  API_TOKEN_SUCCESS,
  API_TOKEN_FAILURE,
  API_TOKEN_DELETED
} from '../actions/actionTypes';

export function tokenConnect(state = initialState.tokenConnect, action) {
  switch (action.type) {
    case API_TOKEN_REQUEST:
      return { ...state, fetching: true, error: null, message: null };
    case API_TOKEN_SUCCESS:
      return { ...state, fetching: false, tokenConnect: action.tokenConnect };
    case API_TOKEN_FAILURE:
      return { ...state, fetching: false, error: action.error, message: action.message };
    case API_TOKEN_DELETED:
      return { ...state, fetching: false, tokenConnect: null };
    default:
      return state;
  }
}
