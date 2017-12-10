// import React from 'react';
// import {
//     Image,
//     Text, View, TouchableOpacity, Dimensions
// } from 'react-native';
// import { StackNavigator } from 'react-navigation';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// import AllStore from '../screens/store/AllStore';
// import StoreDetail from '../screens/store/StoreDetail';

// const WIDTH = Dimensions.get('window').width;

// export const CheckoutStack = StackNavigator({
//     AllStore: {
//         screen: AllStore,
//         navigationOptions: {
//             header: (
//                 <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#4AF2A1' }}>
//                     <Image source={require('../img/logofarmily.png')} style={{ marginBottom: 5, marginTop: 10, width: 80, height: 40, resizeMode: 'stretch' }} />
//                 </View>
//             )
//         }
//     },
//     StoreDetail: {
//         screen: StoreDetail,
//         navigationOptions: ({ navigation }) => ({
//             header: (
//                 <View style={{ alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#4AF2A1', flexDirection: 'row' }}>
//                     <TouchableOpacity style={{ paddingTop: 10 }} onPress={() => navigation.goBack()}>
//                         <Icon name='keyboard-arrow-left' size={40} color='#234D8D' />
//                     </TouchableOpacity>
//                     <Image source={require('../img/logofarmily.png')} style={{ marginLeft: -40, marginBottom: 5, marginTop: 10, width: 80, height: 40, resizeMode: 'stretch' }} />
//                     <View></View>
//                 </View>
//             )
//         })
//     },
// }, {

//     });

// const styles = {
//     icon: {
//         width: 26,
//         height: 26,
//     },

// };

// export default CheckoutStack;
