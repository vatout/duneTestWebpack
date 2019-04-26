import initialState from './initialState';

import {
    LOADER_END,
    LOADER_START
} from '../actions/actionTypes';

export function loader(state = initialState.loader, action) {
    switch (action.type) {
        case LOADER_START:
            return { ...state, loading: true };
        case LOADER_END:
            return { ...state, loading: false };
        default:
            return state;
    }
}
