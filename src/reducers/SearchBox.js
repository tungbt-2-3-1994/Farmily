import { TOGGLE_SEARCH, UNTOGGLE_SEARCH } from '../actions/types';

const INITIAL = {
    typing: false
};

export default (state = INITIAL, action) => {
    switch (action.type) {
        case TOGGLE_SEARCH:
            return { ...state, typing: true };
        case UNTOGGLE_SEARCH:
            return { ...state, typing: false };
        default:
            return state;
    }
}