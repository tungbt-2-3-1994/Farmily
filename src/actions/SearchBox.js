import { TOGGLE_SEARCH, UNTOGGLE_SEARCH } from './types';

export const toggleSearch = () => {
    return (dispatch) => {
        dispatch({
            type: TOGGLE_SEARCH,
        });
    }
}

export const untoggleSearch = () => {
    return (dispatch) => {
        dispatch({
            type: UNTOGGLE_SEARCH,
        });
    }
}