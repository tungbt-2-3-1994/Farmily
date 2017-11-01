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

// import StoreDetailStack from './StoreDetailStack';

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
    }
}, {
    });

const styles = {
    icon: {
        width: 26,
        height: 26,
    },

};

export default StoreStack;

// navigationOptions: ({ navigation }) => ({
        //     header: (
        //         <View style={{ alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#4AF2A1', flexDirection: 'row' }}>
        //             <TouchableOpacity style={{ paddingTop: 10 }} onPress={() => navigation.goBack()}>
        //                 <Icon name='keyboard-arrow-left' size={40} color='#234D8D' />
        //             </TouchableOpacity>
        //             <Image source={require('../img/logofarmily.png')} style={{ marginLeft: -40, marginBottom: 5, marginTop: 10, width: 80, height: 40, resizeMode: 'stretch' }} />
        //             <View></View>
        //         </View>
        //     ),
        // })
