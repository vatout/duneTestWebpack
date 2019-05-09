import initialState from './initialState';

import {
    DOWNLOAD_GAME,
    DOWNLOAD_GAME_FAILURE,
    DOWNLOAD_GAME_SUCCESS,
    INSTALLATION_GAME,
    INSTALLATION_GAME_FAILURE,
    INSTALLATION_GAME_SUCCESS,
} from '../actions/actionTypes';

export function installation(state = initialState.installation, action) {
    switch (action.type) {
        case DOWNLOAD_GAME:
            return { ...state, download: true, error: false };
        case DOWNLOAD_GAME_FAILURE:
            return { ...state, download: false, error: true, message: action.message };
        case DOWNLOAD_GAME_SUCCESS:
            return { ...state, download: false, error: false };
        case INSTALLATION_GAME:
            return { ...state, installation: true, error: false, dirPath: action.path };
        case INSTALLATION_GAME_FAILURE:
            return { ...state, installation: false, download: false, error: true, message: action.message };
        case INSTALLATION_GAME_SUCCESS:
            return { ...state, installation: false, error: false };
        default:
            return state;
    }
}
