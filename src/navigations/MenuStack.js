import React from 'react';
import {
    Image, View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Menu from '../screens/menu/Menu';
import CompatibleMenu from '../screens/menu/CompatibleMenu';
import EditDir from '../screens/menu/EditDir';

export const MenuStack = StackNavigator({
    Menu: {
        screen: Menu,
        navigationOptions: {
            title: 'Danh sách rau'
        }
    },
    CompatibleMenu: {
        screen: CompatibleMenu,
        navigationOptions: {
            title: 'Cửa hàng phù hợp',
            headerBackTitle: null
        }
    },
    EditDir: {
        screen: EditDir,
        navigationOptions: {
            title: 'Chỉnh sửa'
        }
    }
}, {

    });

export default MenuStack;
