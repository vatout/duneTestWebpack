import initialState from './initialState';

import {
  API_TOKEN_DELETE,
  API_TOKEN_DELETE_SUCCESS,
  API_TOKEN_DELETE_FAILURE
} from '../actions/actionTypes';

export function tokenDelete(state = initialState.tokenConnect, action) {
  switch (action.type) {
    case API_TOKEN_DELETE:
      return { ...state, fetching: true, error: false };
    case API_TOKEN_DELETE_SUCCESS:
      return { ...state, tokenConnect: null, fetching: false };
    case API_TOKEN_DELETE_FAILURE:
      return { ...state, fetching: false, error: action.error, message: action.message };
    default:
      return state;
  }
}
