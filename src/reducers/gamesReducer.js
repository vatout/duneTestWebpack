import initialState from './initialState';

export function games(state = initialState.games, action) {
  switch (action.type) {
    case "GET_GAMES_INSTALLED":
      return { ...state, error: false };
    case "GET_GAMES_INSTALLED_SUCCESS":
      return { ...state, error: false, success: true, installed: action.installed };
    case "GET_GAMES_INSTALLED_FAILURE":
      return { ...state, error: true, success: false };
    case "GET_GAMES_NOT_INSTALLED":
      return { ...state, error: false }
    case "GET_GAMES_NOT_INSTALLED_SUCCESS":
      return { ...state, error: false, success: true, available: action.available };
    case "GET_GAMES_NOT_INSTALLED_FAILURE":
      return { ...state, error: true, success: false };
    case "UPDATE_GAMELIST":
      return { ...state, error: false };
    case "UPDATE_GAMELIST_SUCCESS":
      return { ...state, error: false };
    case "UPDATE_GAMELIST_FAILURE":
      return { ...state, error: false };
    default:
      return state;
  }
}
