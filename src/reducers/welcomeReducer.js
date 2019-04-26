import initialState from './initialState';

export function welcome(state = initialState.welcome, action) {
  switch (action.type) {
    case "WELCOME_CONNECTION":
      return { ...state, connection: false };
    default:
      return state;
  }
}
