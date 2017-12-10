import { FETCH_STORE_BY_ID } from '../actions/types';

const INITIAL = {
    loading: true,
    storeById: {}
};

export default (state = INITIAL, action) => {
    switch (action.type) {
        case FETCH_STORE_BY_ID:
            return { ...state, loading: false, storeById: action.payload };
        default:
            return state;
    }
}