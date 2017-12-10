import React from 'react';
import {
    Image,
    Text, View, TouchableOpacity, Dimensions
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AllStore from '../screens/store/AllStore';
import OrderItem from '../screens/store/OrderItem';
import StoreDetail from '../screens/store/StoreDetail';
import Fanpage from '../screens/store/Fanpage';

const WIDTH = Dimensions.get('window').width;

export const StoreStack = StackNavigator({
    AllStore: {
        screen: AllStore,
        navigationOptions: {
            title: 'Cửa hàng'
        }
    },
    StoreDetail: {
        screen: StoreDetail,
        navigationOptions: {
            title: 'Danh sách sản phẩm'
        }
    },
    OrderItem: {
        screen: OrderItem,
        navigationOptions: {
            title: 'Sản phẩm'
        }
    },
    Fanpage: {
        screen: Fanpage,
        navigationOptions: {
            title: 'Fanpage'
        }
    }
}, {
    });

export default StoreStack;
