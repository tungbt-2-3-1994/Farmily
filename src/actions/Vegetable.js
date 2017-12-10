import { Alert, BackHandler, Platform } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import { NavigationActions } from 'react-navigation';

import { GET_ALL_VEGETABLES } from './types';

export const getAllVegetables = () => {
    return (dispatch) => {
        // call API get all stores
        fetch('https://farm.ongnhuahdpe.com/vegetables')
            .then(response => response.json())
            .then((responseData) => {
                // console.log('veget', responseData);
                if (responseData.status === 'success') {
                    let data = responseData.data.map((item) => {
                        item.check = false;
                        item.quantity = 0;
                        return item;
                    });
                    // console.log('data', data);
                    dispatch({
                        type: GET_ALL_VEGETABLES,
                        payload: data
                    });
                } else if (responseData.status === 'error') {
                    Alert.alert('Có lỗi xảy ra khi lấy rau về');
                }
            }).catch(error => Alert.alert(
                'Bảo trì',
                'Bảo trì server',
                [
                    {
                        text: 'OK', onPress: () => {
                            (Platform.OS === 'ios') ? RNExitApp.exitApp() : BackHandler.exitApp();
                        }
                    },
                ]
            ));
    }
}
