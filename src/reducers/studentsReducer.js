import initialState from './initialState';
import {
  GET_STUDENTS_SUCCESS,
  GET_STUDENTS_ERROR,
} from '../actions/actionTypes';

export function students(state = initialState.students, action) {

  switch (action.type) {
    case GET_STUDENTS_SUCCESS:
      return { ...state, asking: false, error: false, content: action.content, success: false };
    case GET_STUDENTS_ERROR:
      return { ...state, asking: false, error: true, success: false };
    default:
      return state;
  }

}
