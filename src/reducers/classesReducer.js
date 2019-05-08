import initialState from './initialState';
import {GET_CLASSES_REQUEST, GET_CLASSES_SUCCESS, GET_CLASSES_ERROR} from "../actions/actionTypes";

export function classes(state = initialState.classes, action) {
  switch (action.type) {
    case GET_CLASSES_REQUEST:
      return { ...state,  pending: true};
    case GET_CLASSES_SUCCESS:
      return { ...state, pending: false, classes: action.classes, success: true, error: false};
    case GET_CLASSES_ERROR:
      return {...state, pending: false, success: false, error: true, errorCode: action.error}
    default:
      return state;
  }

}
