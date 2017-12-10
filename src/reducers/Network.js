import { CHANGE_CONNECTION_STATUS } from '../actions/types';

const INITIAL = {
    isConnected: false,
};

export default (state = INITIAL, action) => {
    switch (action.type) {
        case CHANGE_CONNECTION_STATUS:
            return { ...state, isConnected: action.isConnected };
        default:
            return state;
    }
}