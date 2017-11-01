import { GET_NEARBY_STORES, GET_ALL_STORES, FETCH_STORE_BY_ID, FAIL_TO_GET_STORES, LOGOUT } from '../actions/types';

const INITIAL = {
    loading: true,
    stores: []
};

export default (state = INITIAL, action) => {
    switch (action.type) {
        case GET_ALL_STORES:
            return { ...state, loading: false, stores: action.payload };
        case GET_NEARBY_STORES:
            return { ...state, loading: false, stores: action.payload };
        case FAIL_TO_GET_STORES:
            return { ...state, loading: false, stores: [] };
        case LOGOUT:
            return { ...state, loading: true, stores: [] };
        default:
            return state;
    }
}