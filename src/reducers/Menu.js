import { ADD_ITEM_TO_MENU, LOGOUT, UPDATE_MENU, GET_COMPATIBLE_STORES } from '../actions/types';

const INITIAL = {
    menu: [],
    compatibleMenu: []
};

export default (state = INITIAL, action) => {
    switch (action.type) {
        case UPDATE_MENU:
            return { ...state, menu: action.payload };
        case GET_COMPATIBLE_STORES:
            return { ...state, compatibleMenu: action.payload };
        case LOGOUT:
            return { ...state };
        default:
            return state;
    }
}