import { GET_ALL_VEGETABLES, LOGOUT } from '../actions/types';

const INITIAL = {
    loading: true,
    vegetables: []
};

export default (state = INITIAL, action) => {
    switch (action.type) {
        case GET_ALL_VEGETABLES:
            return { ...state, loading: false, vegetables: action.payload };
        case LOGOUT:
            return {
                ...state,
                vegetables: state.vegetables.map(vegetable => 1 == 1 ? { ...vegetable, check: false } : vegetable)
            };
        default:
            return state;
    }
}