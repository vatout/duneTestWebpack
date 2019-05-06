import initialState from './initialState';

import {
    PROCESS_START,
    PROCESS_START_FAILURE,
    PROCESS_START_SUCCESS,
    PROCESS_END,
    PROCESS_END_FAILURE,
    PROCESS_END_SUCCESS,
} from '../actions/actionTypes';

export function process(state = initialState.process, action) {
    switch (action.type) {
        case PROCESS_START:
            return { ...state, start: true, error: false };
        case PROCESS_START_FAILURE:
            return { ...state, start: false, error: true, message: action.message };
        case PROCESS_START_SUCCESS:
            return { ...state, start: false, error: false, idGP: action.idGP };
        case PROCESS_END:
            return { ...state, end: true, error: false, dirPath: action.path };
        case PROCESS_END_FAILURE:
            return { ...state, end: false, error: true, message: action.message };
        case PROCESS_END_SUCCESS:
            return { ...state, end: false, error: false, idGp: null };
        default:
            return state;
    }
}
