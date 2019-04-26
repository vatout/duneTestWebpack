import initialState from './initialState';

export function professor(state = initialState.professor, action) {
  switch (action.type) {
    case "API_PROF_ID":
      return { ...state, error: false, professorId: action.professorId };
    case "GET_PROF_SUCCESS":
      return { ...state, error: false, success: true, nom: action.nom, prenom: action.prenom, email: action.email };
    case "GET_PROF_FAILURE":
      return { ...state, error: true, success: false };
    case "DELETE_PROF":
      return { ...state, error: false, success: false, professorId: null };  
    default:
      return state;
  }
}
