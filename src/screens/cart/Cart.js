import React, { Component } from 'react';
import {
    View,
    Text,
    Image, Alert, DeviceEventEmitter,
    FlatList, Dimensions, TouchableOpacity, Platform, AppState
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.15;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

import { getAllItems, deleteItemInCart } from '../../actions/';


class Cart extends Component {

    state = {
        cartGoods: [],
        cartLoading: true,
        price: 0,
        coords: [],
        region: {
            latitude: 21.028094,
            longitude: 105.825468,
            latitudeDelta: 0.3,
            longitudeDelta: 0.3
        },
        storeLocation: {
            latitude: 0,
            longitude: 0,
        },
        storeName: 'Cửa hàng',
        startLoc: '21.028094, 105.825468',
        endLoc: '21.028094, 105.825468'
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTitleStyle: { color: 'white', fontFamily: 'Baskerville-BoldItalic', fontSize: 20 },
    }

    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            this.setState({ coords: coords })
            return coords
        } catch (error) {
            Alert.alert(
                'Thông báo',
                'Có lỗi xảy ra khi tìm đường. Tìm kiếm lại',
                [
                    { text: 'Ok', onPress: () => this.getDirections(startLoc, destinationLoc) },
                ],
                { cancelable: false }
            );
            return error
        }
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.user != null && !nextProps.loadingGeo && nextProps.user.coords != null) {
            // console.log('1');
            var { coords } = nextProps.user;
            // console.log('location', coords);
            this.setState({
                region: {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
            });
        }

        if (!nextProps.cartLoading && nextProps.storeLocation != null) {
            this.setState({
                storeLocation: {
                    latitude: nextProps.storeLocation.latitude,
                    longitude: nextProps.storeLocation.longitude
                },
                storeName: nextProps.storeLocation.name
            });
            if (nextProps.user.coords != null) {
                let start = nextProps.userLocation.latitude + ',' + nextProps.userLocation.longitude;
                let end = nextProps.storeLocation.latitude + ',' + nextProps.storeLocation.longitude;
                this.getDirections(start, end);
            }
        }

        this.setState({
            cartGoods: nextProps.cart,
            cartLoading: nextProps.cartLoading
        });

        if (nextProps.user.coords != null && nextProps.storeLocation !== null && !nextProps.loadingGeo && !nextProps.cartLoading) {
            let start = nextProps.userLocation.latitude + ',' + nextProps.userLocation.longitude;
            let end = nextProps.storeLocation.latitude + ',' + nextProps.storeLocation.longitude;
            this.getDirections(start, end);
        }


        if (!nextProps.cartLoading && nextProps.cart.length > 0) {
            var sum = 0;
            const { cart } = nextProps;
            // console.log(cart);
            for (var i = 0; i < nextProps.cart.length; i++) {
                sum += cart[i].quantity * cart[i].vegetable_in_store.price;
            }
            this.setState({ price: sum });
        }

        if (nextProps.cart.length === 0) {
            this.setState({ price: 0 });
        }

    }

    //update permissions when app comes back from settings
    _handleAppStateChange(appState) {
        if (appState == 'active') {
            this.setState({ coords: [] });
        }
    }

    componentWillUnmount() {
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }

    emptyListComponent() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ fontFamily: 'Baskerville-BoldItalic', fontSize: 20 }}>Giỏ hàng của bạn chưa có gì</Text>
            </View>)
    }

    checkout = () => {
        if (this.props.cart.length === 0) {
            Alert.alert('Giỏ hàng bạn chưa có gì nên chưa thể thanh toán');
        } else {
            this.props.navigation.navigate('CheckoutStack');
        }
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }

    render() {

        var latlng = {
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude
        }

        var storeLatLng = {
            latitude: this.state.storeLocation.latitude,
            longitude: this.state.storeLocation.longitude,
        }

        let store;
        if (typeof (this.state.storeLocation) !== null) {
            // console.log('la sao');
            store = (<MapView.Marker
                key={this.state.storeLocation.latitude}
                coordinate={storeLatLng}
                title={this.state.storeName}
            >
                {Platform.OS === 'ios' &&
                    <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../img/store.png')}>

                    </Image>}
                {Platform.OS === 'android' &&
                    <Image style={{ width: 30, height: 30, resizeMode: 'contain' }}
                        onLoad={() => this.forceUpdate()}
                        onLayout={() => this.forceUpdate()}
                        source={require('../../img/store.png')}>
                        <Text style={{ width: 0, height: 0 }}>{Math.random()}</Text>
                    </Image>}
            </MapView.Marker>);
        } else {
            // console.log('la sao 2');
            store = null;
        }

        return (
            (this.props.loggedIn && !this.state.cartLoading) ?
                (
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 0.5 }}>
                            <MapView style={{ flex: 1 }} initialRegion={this.state.region}>
                                {this.state.coords.length != 0 &&
                                    <MapView.Polyline
                                        coordinates={this.state.coords}
                                        strokeWidth={3}
                                        strokeColor="blue" />
                                }

                                {this.props.user.coords != null &&
                                    <MapView.Marker
                                        key={this.state.region.latitude}
                                        coordinate={latlng}
                                        title='Vị trí của bạn'
                                    />}
                                {store}
                            </MapView>
                        </View>
                        <FlatList
                            style={styles.flatList}
                            data={this.state.cartGoods}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('EditStack', {
                                            'uri': item.vegetable_in_store.vegetable.images.length != 0 ? item.vegetable_in_store.vegetable.images[0] : null,
                                            'quantity': item.quantity,
                                            'itemId': item.id
                                        })
                                    }}
                                    style={styles.callout}>
                                    {item.vegetable_in_store.vegetable.images.length != 0 ?
                                        <Image style={styles.calloutPhoto} source={{ uri: item.vegetable_in_store.vegetable.images[0] }} />
                                        :
                                        <Image style={styles.calloutPhoto} source={require('../../img/noImage.jpg')} />
                                    }

                                    <View style={styles.textInfo}>
                                        <Text style={styles.calloutTitle}>{item.vegetable_in_store.vegetable.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {/* <Icon name='attach-money' size={20} color='#7BC477' /> */}
                                            <Text style={{ marginLeft: 5, fontSize: 16, color: '#7BC477' }}>Giá: </Text>
                                            {/* <Text style={{ fontSize: 16, color: '#7BC477' }}>:</Text> */}
                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>{item.vegetable_in_store.price} đồng</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                            <Text style={{ marginLeft: 5, fontSize: 16, color: '#7BC477' }}>Số lượng: </Text>
                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>{item.quantity} kg</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            Alert.alert(
                                                'Xác nhận',
                                                'Bạn có muốn xóa hàng hóa này không?',
                                                [
                                                    { text: 'Đồng ý', onPress: () => this.props.deleteItemInCart(item.id) },
                                                    { text: 'Hủy bỏ', onDimiss: () => { } },
                                                ],
                                                { cancelable: false }
                                            )
                                        }} style={{ position: 'absolute', right: 6, top: 1 }}>
                                            <Icon name='cancel' color='red' size={25} />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={this.emptyListComponent.bind(this)}
                        />
                        <View style={{ flexDirection: 'row', flex: 0.1, marginBottom: 53, justifyContent: 'space-between' }}>
                            <Text></Text>
                            <Text>
                                <Text>Tổng: </Text>
                                <Text style={{ color: 'red', fontFamily: 'Baskerville-BoldItalic', fontSize: 20, paddingRight: 10, paddingBottom: 5 }}>{this.state.price} </Text>
                                <Text>đồng</Text>
                            </Text>

                        </View>

                        <View style={styles.checkout}>
                            <TouchableOpacity onPress={() => { this.checkout() }} style={{ flexDirection: 'row', flex: 0.8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#31A85E', borderRadius: 5 }}>
                                <Text style={{ paddingLeft: 10, fontFamily: 'Baskerville-BoldItalic', color: 'white', fontSize: 20 }}>Thanh toán</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                :
                (
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Text>Bạn chưa đăng nhập nên chưa có giỏ hàng nào</Text>
                    </View>
                )
        );
    }
}

const styles = {
    pin: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkout: {
        position: 'absolute',
        width: width,
        height: 45,
        bottom: 0,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    buttonAdd: {
        alignItems: 'center',
        height: 50,
        backgroundColor: '#EE554E',
        justifyContent: 'center',
        borderRadius: 4,
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        width: window.width
    },
    buttonText: {
        fontSize: 20,
        color: '#FAFAFA',
    },
    flatList: {
        flex: 0.4,
        margin: 5,
    },
    callout: {
        flex: 1,
        width: width - 10,
        height: 80,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#CACACA',
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'white',
        marginBottom: 5
    },
    calloutPhoto: {
        flex: 0.2,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignSelf: 'center',
        resizeMode: 'stretch',
    },
    calloutTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 5,
        fontFamily: 'Baskerville-BoldItalic',
        color: '#7BC477'
    },
    calloutDescription: {
        fontSize: 10
    },
    textInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 0.8,
        paddingBottom: 3
    },
};

const mapStateToProps = (state) => {
    // console.log('as', state.userInfor.userLocation);
    return ({
        loggedIn: state.userInfor.loggedIn,
        user: state.userInfor.userLocation,
        cart: state.cart.goods.data || [],
        storeLocation: state.cart.goods.store,
        cartLoading: state.cart.loading,
        userLocation: state.userInfor.userLocation.coords,
        loadingGeo: state.userInfor.loading,
    });
}

export default connect(mapStateToProps, { deleteItemInCart, getAllItems })(Cart);
