import React from 'react';
import {
    Image, View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Cart from '../screens/cart/Cart';
import Checkout from '../screens/cart/Checkout';


export const CartStack = StackNavigator({
    CartStack: {
        screen: Cart,
        navigationOptions: {
            title: 'Giỏ hàng'
        }
    },
    CheckoutStack: {
        screen: Checkout,
        navigationOptions: {
            title: 'Thanh toán'
        }
    },

}, {
    });

const styles = {
    icon: {
        width: 26,
        height: 26,
    },

};

export default CartStack;
