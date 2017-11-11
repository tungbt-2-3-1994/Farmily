import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { GET_CURRENT_LOCATION, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from './types';

export const getCurrentLocation = () => {
    return (dispatch) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('123');
                dispatch({
                    type: GET_CURRENT_LOCATION,
                    payload: position
                });
            },
            (error) => {
                console.log(error.message);
                dispatch({
                    type: GET_CURRENT_LOCATION,
                    payload: { 'coords': null }
                });
            },
            { timeout: 20000, maximumAge: 1000 }
        );
    }
}

export const normalSignUp = (name, email, pass, verify) => {
    return (dispatch) => {
        fetch(`https://farm.ongnhuahdpe.com/session`)
            .then(response => response.json())
            .then((tokenData) => {
                if (tokenData.status == 'warning') {
                    const token = tokenData.token;
                    fetch('https://farm.ongnhuahdpe.com/session/register', {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': token,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'name': name,
                            'email': email,
                            'password': pass,
                            'password_confirmation': verify,
                        })
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            console.log('responseData', responseData);
                            if (typeof responseData.status == 'undefined' || responseData.status == 'error') {
                                Alert.alert('Email này đã được sử dụng rồi, mời bạn đăng ký email khác');
                            } else {
                                dispatch({
                                    type: LOGIN_SUCCESS,
                                    payload: responseData.data
                                });
                                const navigateToAccount = NavigationActions.back({
                                    routeName: 'AccountStack'
                                });
                                dispatch(navigateToAccount);
                            }
                        })
                        .done();
                } else if (tokenData.status == 'success') {
                    // da dang nhap
                    console.log('loggedIn', tokenData);
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: tokenData.data
                    });
                }
            }).catch(error => console.log('error', error))
    }
}

export const socialLogin = (name, userId, avatar_url) => {
    return (dispatch) => {
        fetch(`https://farm.ongnhuahdpe.com/session`)
            .then(response => response.json())
            .then((tokenData) => {
                if (tokenData.status == 'warning') {
                    const token = tokenData.token;
                    fetch('https://farm.ongnhuahdpe.com/session/login', {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': token,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'name': name,
                            'provider': '1',
                            'provider_user_token': userId,
                            'avatar_url': avatar_url
                        })
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            console.log('responseData', responseData);
                            dispatch({
                                type: LOGIN_SUCCESS,
                                payload: responseData.data
                            });
                        })
                        .done();
                } else if (tokenData.status == 'success') {
                    // da dang nhap
                    console.log('loggedIn', tokenData);
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: tokenData.data
                    });
                }
            }).catch(error => console.log('error', error))
    }
}

export const logout = () => {
    return (dispatch) => {
        fetch('https://farm.ongnhuahdpe.com/session/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then((responseData) => {
                dispatch({
                    type: LOGOUT
                });
            })
    }
}

export const autoCheckLogin = () => {
    return (dispatch) => {
        fetch('https://farm.ongnhuahdpe.com/session')
            .then(response => response.json())
            .then((responseData) => {
                if (responseData.status == 'success') {
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: responseData.data
                    });
                }
            })
    }
}

export const normalLogin = (email, password) => {
    // console.log(email, password);
    return (dispatch) => {
        fetch(`https://farm.ongnhuahdpe.com/session`)
            .then(response => response.json())
            .then((tokenData) => {
                if (tokenData.status == 'warning') {
                    const token = tokenData.token;
                    fetch(`https://farm.ongnhuahdpe.com/session/login`, {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': token,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'email': email,
                            'password': password
                        })
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            if (responseData.status == 'error') {
                                Alert.alert('Bạn cần nhập thông tin chính xác');
                                dispatch({
                                    type: LOGIN_FAIL,
                                    payload: false
                                });

                            } else if (responseData.status == 'success') {
                                // console.log('data token', responseData.data);
                                dispatch({
                                    type: LOGIN_SUCCESS,
                                    payload: responseData.data
                                });
                            }

                        })
                        .done();
                } else if (tokenData.status == 'success') {
                    // da dang nhap
                    console.log('loggedIn', tokenData);
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: tokenData.data
                    });
                }

            }).catch(error => console.log('error', error))
    }
}