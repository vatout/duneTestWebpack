import initialState from './initialState';

export function files(state = initialState.files, action) {
  switch (action.type) {
    case "GET_FILES":
      return { ...state, error: false };
    case "GET_FILES_SUCCESS":
      return { ...state, error: false, success: true, results: action.results };
    case "GET_FILES_FAILURE":
      return { ...state, error: true, success: false };
    default:
      return state;
  }
}
