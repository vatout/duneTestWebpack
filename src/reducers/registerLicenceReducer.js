import initialState from './initialState';

// action types
import {
  API_LICENCE_REQUEST,
  API_LICENCE_SUCCESS,
  API_LICENCE_FAILURE,
} from '../actions/actionTypes';

export function licence(state = initialState.licence, action) {
  switch (action.type) {
    case API_LICENCE_REQUEST:
      return { ...state, fetching: true, error: null };
    case API_LICENCE_SUCCESS:
      return { ...state, fetching: false, licence: action.licence, idTable: action.idTable };
    case API_LICENCE_FAILURE:
      return { ...state, fetching: false, error: action.error, message: action.message };
    default:
      return state;
  }
}
