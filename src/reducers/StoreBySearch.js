import { SEARCH_STORE_BY_ADD_INFOR } from '../actions/types';

const INITIAL = {
    loading: true,
    stores: []
};

export default (state = INITIAL, action) => {
    switch (action.type) {
        case SEARCH_STORE_BY_ADD_INFOR:
            return { ...state, loading: false, stores: action.payload };
        default:
            return state;
    }
}