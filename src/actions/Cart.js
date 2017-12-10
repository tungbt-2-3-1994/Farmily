import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { DELETE_ITEM_IN_CART, GET_CHECKOUT_CART, GET_ALL_ITEMS, ADD_ITEM_TO_CART, UPDATE_ITEM_IN_CART, CANCEL_CHECKOUT } from './types';

export const getCheckoutCart = () => {
    return (dispatch) => {
        fetch('http://farm.ongnhuahdpe.com/orders')
            .then(response => response.json())
            .then(responseData => {
                console.log('response', responseData);
            }).catch(error => console.log('err', error));
    }
}

export const deleteItemInCart = (id) => {
    // console.log('a', id);
    return (dispatch) => {
        fetch('https://farm.ongnhuahdpe.com/cart/items/delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'items': [id]
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                // console.log(responseData);
                if (responseData.status === 'success') {
                    dispatch({
                        type: GET_ALL_ITEMS,
                        payload: responseData
                    });
                    // console.log('a', responseData);
                } else if (responseData.status === 'error') {
                    // console.log(responseData);
                    Alert.alert('Có lỗi xảy ra khi xóa mặt hàng');
                }
            })
            .done();
    }
}


export const cancelCheckout = () => {
    console.log('asas');
    return (dispatch) => {
        fetch('https://farm.ongnhuahdpe.com/cart/checkout/cancel')
            .then((res) => {
                console.log('asasT');
                fetch('https://farm.ongnhuahdpe.com/cart/items')
                    .then(response => response.json())
                    .then((responseData) => {
                        if (responseData.status === 'success') {
                            console.log(responseData);
                            dispatch({
                                type: GET_ALL_ITEMS,
                                payload: responseData
                            });
                            const backAction = NavigationActions.back({
                                routeName: 'CartStack'
                            });
                            dispatch(backAction);
                        } else if (responseData.status === 'error') {
                            Alert.alert('Có lỗi xảy ra khi lấy item về');
                        }
                    }).catch(error => console.log('error', error))
            }
            )
    }
}

export const getAllItems = () => {
    return (dispatch) => {
        // call API get all stores
        fetch('https://farm.ongnhuahdpe.com/cart/items')
            .then(response => response.json())
            .then((responseData) => {
                if (responseData.status === 'success') {
                    // console.log(responseData);
                    dispatch({
                        type: GET_ALL_ITEMS,
                        payload: responseData
                    });
                } else if (responseData.status === 'error') {
                    Alert.alert('Có lỗi xảy ra khi lấy item về');
                }
            }).catch(error => console.log('error', error));
    }
}

export const goBackToMain = () => {
    return (dispatch) => {
        // call API get all stores
        fetch('https://farm.ongnhuahdpe.com/cart/items')
            .then(response => response.json())
            .then((responseData) => {
                if (responseData.status === 'success') {
                    // console.log(responseData);
                    dispatch({
                        type: GET_ALL_ITEMS,
                        payload: responseData.data
                    });
                    const backAction = NavigationActions.back({
                        routeName: 'CartStack'
                    });
                    dispatch(backAction);
                } else if (responseData.status === 'error') {
                    Alert.alert('Có lỗi xảy ra khi lấy item về');
                }
            }).catch(error => console.log('error', error));
    }
}

export const addItemToCart = (vegetableId, storeId, quantity) => {
    return (dispatch) => {
        fetch('https://farm.ongnhuahdpe.com/cart/items', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'vegetables': [
                    { 'id': vegetableId, 'quantity': quantity }
                ],
                'store_id': storeId
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                // console.log(responseData);
                if (responseData.status === 'success') {
                    dispatch({
                        type: ADD_ITEM_TO_CART,
                        payload: responseData
                    });
                    Alert.alert('Thêm vào giỏ hàng thành công');
                } else if (responseData.status === 'error') {
                    Alert.alert('Bạn cần đăng nhập mới có thể thêm hàng vào giỏ');
                    const naviToAcc = NavigationActions.navigate({
                        routeName: 'Account'
                    });
                    dispatch(naviToAcc);
                }
            })
            .done();
    }
}

export const addItemToCartAll = (dataToDel, data, storeId) => {
    // console.log('data', data);
    // console.log('dataToDel', dataToDel);

    return (dispatch) => {
        if (dataToDel.length > 0) {
            fetch('https://farm.ongnhuahdpe.com/cart/delete')
                .then((response) => response.json())
                .then((responseData) => {
                    // console.log(responseData);
                })
                .catch(error => console.log(error))
        }
        fetch('https://farm.ongnhuahdpe.com/cart/items', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'vegetables': data,
                'store_id': storeId
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                // console.log(responseData);
                if (responseData.status === 'success') {
                    dispatch({
                        type: ADD_ITEM_TO_CART,
                        payload: responseData
                    });
                    const navigateToCart = NavigationActions.navigate({
                        routeName: 'CartStack',
                    });
                    dispatch(navigateToCart);
                } else if (responseData.status === 'error') {
                    Alert.alert('Bạn cần đăng nhập mới có thể thêm hàng vào giỏ');
                    const naviToAcc = NavigationActions.navigate({
                        routeName: 'Account'
                    });
                    dispatch(naviToAcc);
                }
            })
            .done();
    }
}

export const updateItemInCart = (itemId, quantity) => {
    return (dispatch) => {
        fetch(`https://farm.ongnhuahdpe.com/cart/items/${itemId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'quantity': quantity,
                'checked': 1
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status === 'success') {
                    dispatch({
                        type: UPDATE_ITEM_IN_CART,
                        payload: responseData
                    });
                    // const back = NavigationActions.back({
                    //     routeName: 'CartStack',
                    // });
                    // dispatch(back);
                } else if (responseData.status === 'error') {
                    Alert.alert('Gặp sự cố khi update giỏ');
                }
            })
            .done();
    }
}

// export const checkout = () => {
//     return (dispatch) => {
//         fetch('http://farm.ongnhuahdpe.com/cart/items')
//             .then(response => response.json())
//             .then((responseData) => {
//                 if (responseData.status === 'success') {
//                     console.log(responseData);
//                     dispatch({
//                         type: GET_ALL_ITEMS,
//                         payload: responseData.data
//                     });
//                 } else if (responseData.status === 'error') {
//                     Alert.alert('Có lỗi xảy ra khi lấy item về');
//                 }
//             }).catch(error => console.log('error', error));
//     }
// }

