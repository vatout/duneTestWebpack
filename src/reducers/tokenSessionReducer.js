import initialState from './initialState';

import {
  API_TOKEN_SESSION,
} from '../actions/actionTypes';

export function tokenSession(state = initialState.tokenSession, action) {
  switch (action.type) {
    case API_TOKEN_SESSION:
      return { ...state, tokenSession: action.tokenSession };
    default:
      return state;
  }
}
