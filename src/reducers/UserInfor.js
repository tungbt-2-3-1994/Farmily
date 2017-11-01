import { GET_CURRENT_LOCATION, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/types';

const INITIAL = {
    loading: true,
    userLocation: {},
    loggedIn: false,
    user: null
};

export default (state = INITIAL, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, loggedIn: true, user: action.payload };
        case LOGIN_FAIL:
            return { ...state, loggedIn: action.payload };
        case LOGOUT:
            return { ...state, loggedIn: false, user: null, loading: true };
        case GET_CURRENT_LOCATION:
            return { ...state, loading: false, userLocation: action.payload };
        default:
            return state;
    }
}