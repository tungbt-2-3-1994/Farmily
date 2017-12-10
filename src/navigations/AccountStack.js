import React from 'react';
import {
    Image, View, Easing, Animated
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Account from '../screens/account/Account';
import SignUp from '../screens/account/SignUp';


export const AccountStack = StackNavigator({
    AccountStack: {
        screen: Account,
        navigationOptions: {
            title: 'Tài khoản'
        }
    },
    SignUpStack: {
        screen: SignUp,
        navigationOptions: {
            title: 'Đăng ký'
        }
    }
}, {
        mode: 'modal',
        transitionConfig: () => ({
            transitionSpec: {
                duration: 500,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
            },
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;

                const height = layout.initHeight;
                const translateY = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [height, 0, 0],
                });

                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index],
                    outputRange: [0, 1, 1],
                });

                return { opacity, transform: [{ translateY }] };
            },
        }),
    });

const styles = {
    icon: {
        width: 26,
        height: 26,
    },

};

export default AccountStack;
