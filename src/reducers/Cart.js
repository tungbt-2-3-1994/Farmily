import { GET_ALL_ITEMS, ADD_ITEM_TO_CART, LOGOUT, UPDATE_ITEM_IN_CART } from '../actions/types';

const INITIAL = {
    loading: true,
    goods: {}
};

export default (state = INITIAL, action) => {
    switch (action.type) {
        case GET_ALL_ITEMS:
            return { ...state, loading: false, goods: action.payload };
        case ADD_ITEM_TO_CART:
            return { ...state, loading: false, goods: action.payload };
        case UPDATE_ITEM_IN_CART:
            return { ...state, loading: false, goods: action.payload };
        case LOGOUT:
            return INITIAL;
        default:
            return state;
    }
}