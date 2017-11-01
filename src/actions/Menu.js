import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { GET_CURRENT_MENU, ADD_ITEM_TO_MENU, UPDATE_MENU, GET_COMPATIBLE_STORES } from './types';

export const addItemToMenu = (item) => {
    return (dispatch) => {
        dispatch({
            type: ADD_ITEM_TO_MENU,
            payload: item
        });
    }
}

export const updateMenu = (menu) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_MENU,
            payload: menu
        });
    }
}

export const updateMenuBack = (menu) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_MENU,
            payload: menu
        });
        const back = NavigationActions.back({
            routeName: 'Menu',
        });
        dispatch(back);
    }
}

export const getCompatibleStore = (lat, lng, vegIds, quantity) => {
    // console.log('quan', quantity);
    return (dispatch) => {
        fetch(`https://farm.ongnhuahdpe.com/stores?items_per_page=3&latitude=${lat}&longitude=${lng}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'vegetables': vegIds
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                // console.log('responseData', responseData);
                dispatch({
                    type: GET_COMPATIBLE_STORES,
                    payload: responseData.data
                });
                const navigateToCompaMenu = NavigationActions.navigate({
                    routeName: 'CompatibleMenu',
                    params: {
                        'data': vegIds,
                        'quantityData': quantity
                    }
                });
                dispatch(navigateToCompaMenu);
            })
            .done();
    }
}


