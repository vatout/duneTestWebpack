import initialState from './initialState';

import {
  API_TOKEN_VALIDATE,
  API_TOKEN_VALIDATE_SUCCESS,
  API_TOKEN_VALIDATE_FAILURE
} from '../actions/actionTypes';

export function tokenValidate(state = initialState.tokenConnect, action) {
  switch (action.type) {
    case API_TOKEN_VALIDATE:
      return { ...state, fetching: true, error: null };
    case API_TOKEN_VALIDATE_SUCCESS:
      return { ...state, fetching: false, error: null };
    case API_TOKEN_VALIDATE_FAILURE:
      return { ...state, fetching: false, error: true, message: action.message };
    default:
      return state;
  }
}
