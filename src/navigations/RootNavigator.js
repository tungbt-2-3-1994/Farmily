import React, { Component } from 'react';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import { TabNavigator } from 'react-navigation';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconOct from 'react-native-vector-icons/MaterialIcons';

import MenuStack from './MenuStack';
import StoreStack from './StoreStack';
import AccountStack from './AccountStack';
import CartStack from './CartStack';

const RootNav = TabNavigator({
    StoreStack: {
        screen: StoreStack,
        navigationOptions: {
            tabBarLabel: 'Cửa hàng',
        }
    },
    MenuStack: {
        screen: MenuStack,
        navigationOptions: {
            tabBarLabel: 'Danh sách rau',
        }
    },
    CartStack: {
        screen: CartStack,
        navigationOptions: {
            tabBarLabel: 'Giỏ hàng',

        }
    },
    Account: {
        screen: AccountStack,
        navigationOptions: {
            tabBarLabel: 'Tài khoản'
        }
    }
}, {
        tabBarComponent: NavigationComponent,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            bottomNavigationOptions: {
                tabs: {
                    StoreStack: {
                        style: { fontFamily: 'Baskerville-BoldItalic', fontWeight: 40 },
                        labelColor: '#CACACA',
                        
                        icon: <Icon size={20} color='#CACACA' name='store' />,
                        barBackgroundColor: '#F3F3F3',
                        activeLabelColor: '#388E3C',
                        activeIcon: <Icon size={24} color="#388E3C" name="store" />
                    },
                    CartStack: {
                        labelColor: '#CACACA',
                        icon: <Icon size={20} color='#CACACA' name='shopping-cart' />,
                        barBackgroundColor: '#F3F3F3',
                        activeLabelColor: '#388E3C',
                        activeIcon: <Icon size={24} color="#388E3C" name="shopping-cart" />
                    },
                    MenuStack: {
                        labelColor: '#CACACA',
                        icon: <Icon size={20} color='#CACACA' name='restaurant-menu' />,
                        barBackgroundColor: '#F3F3F3',
                        activeLabelColor: '#388E3C',
                        activeIcon: <Icon size={24} color="#388E3C" name="restaurant-menu" />
                    },
                    Account: {
                        barBackgroundColor: '#F3F3F3',
                        labelColor: '#CACACA',
                        icon: <Icon size={20} color='#CACACA' name='account-box' />,
                        activeLabelColor: '#388E3C',
                        activeIcon: <Icon size={24} color="#388E3C" name="account-box" />
                    }
                }
            }
        }
    })

export default RootNav;