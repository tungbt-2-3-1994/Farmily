import React, { Component } from 'react';
import {
    View,
    Text, PanResponder, TextInput, Modal,
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

import { getAllItems, deleteItemInCart, updateItemInCart } from '../../actions/';

import { headerStyle } from '../Style';


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
        endLoc: '21.028094, 105.825468',
        quantity: 0,
        index: 0,
        name: '',
        click: false
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTitleStyle: headerStyle,
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
            this.getDirections(startLoc, destinationLoc);
            return error;
        }
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderGrant: this._onPanRespondGrant.bind(this),
        });
    }

    _onPanRespondGrant(event, gestureState) {
        if (event.nativeEvent.locationX === event.nativeEvent.pageX) {
            this.setState({ click: false });
        }
    }

    onDecrease = () => {
        this.setState({
            quantity: parseInt(this.state.quantity) - 1
        });
    }

    onIncrease = () => {
        this.setState({
            quantity: parseInt(this.state.quantity) + 1
        });
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.user != null && !nextProps.loadingGeo && nextProps.user.coords != null) {
            var { coords } = nextProps.user;
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
                <Text style={{ fontSize: 20, textAlign: 'center', color: '#388E3C' }}>Giỏ hàng của bạn chưa có gì</Text>
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

    updateCart = () => {
        // const { itemId } = this.props.navigation.state.params;
        // console.log('update', this.state.text);
        if (parseInt(this.state.quantity) <= 0 || isNaN(this.state.quantity)) {
            Alert.alert('Bạn cần điền số lượng lớn hơn 0');
        } else {
            this.props.updateItemInCart(this.state.itemId, parseInt(this.state.quantity));
            this.setState({
                click: false
            });
        }
    }

    render() {

        const shadowOpacity = {
            shadowOpacity: 0.5,
            shadowOffset: {
                width: -5,
                height: 5
            }
        }

        const innerShadowOpacity = {
            shadowOpacity: 0.5,
            shadowOffset: {
                width: -5,
                height: 5
            },
            shadowColor: 'black',
            elevation: 20,
            // shadowColor: 'red'
        }


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
                                        this.setState({
                                            click: !this.state.click,
                                            name: item.vegetable_in_store.vegetable.name,
                                            quantity: item.quantity,
                                            itemId: item.id
                                        });
                                    }}
                                    style={styles.callout}>
                                    {item.vegetable_in_store.vegetable.images.length != 0 ?
                                        <Image style={styles.calloutPhoto} source={{ uri: item.vegetable_in_store.vegetable.images[0] }} />
                                        :
                                        <Image style={styles.calloutPhoto} source={require('../../img/noImage.jpg')} />
                                    }

                                    <View style={styles.textInfo}>
                                        <Text style={styles.calloutTitle}>{item.vegetable_in_store.vegetable.name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                            <Text style={{ marginLeft: 5, fontSize: 16, color: '#7BC477' }}>Số lượng: </Text>
                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>{item.quantity} kg</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ marginLeft: 5, fontSize: 16, color: '#7BC477' }}>Giá: </Text>
                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>{(item.vegetable_in_store.price).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')} * {item.quantity} = {(item.vegetable_in_store.price * item.quantity).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')} đồng</Text>
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
                        <View style={{ flexDirection: 'row', flex: 0.1, marginBottom: 58, justifyContent: 'space-between', paddingRight: 10 }}>
                            <Text></Text>
                            <Text>
                                <Text>Tổng: </Text>
                                <Text style={{ color: '#31A85E', fontSize: 20, paddingRight: 10, paddingBottom: 5 }}>{this.state.price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')} </Text>
                                <Text>đồng</Text>
                            </Text>

                        </View>

                        <Modal
                            visible={this.state.click}
                            transparent={true}
                            onRequestClose={() => this.setState({ click: false })}
                        >
                            <View
                                {...this.panResponder.panHandlers}
                                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                                <View style={[styles.editForm, innerShadowOpacity]}>
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>
                                        <Text style={{ fontSize: 16 }}>Số lượng</Text>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#388E3C' }}> {this.state.name} </Text>
                                        <Text style={{ fontSize: 16 }}>muốn mua</Text>
                                    </Text>

                                    <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => this.onDecrease()} style={{ marginRight: 10 }}>
                                            <Text style={{ color: 'red', fontSize: 30 }}>-</Text>
                                        </TouchableOpacity>
                                        <TextInput
                                            style={{ fontSize: 24, borderRadius: 5, borderColor: '#CACACA', borderWidth: 2, width: 100 }}
                                            placeholder='Nhập số lượng'
                                            onChangeText={(quantity) => this.setState({ quantity })}
                                            value={this.state.quantity + ''}
                                            keyboardType='numeric'
                                            textAlign='center'
                                            underlineColorAndroid='transparent'
                                        />
                                        <TouchableOpacity onPress={() => this.onIncrease()} style={{ marginLeft: 10 }}>
                                            <Text style={{ color: '#388E3C', fontSize: 30 }}>+</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => { this.setState({ click: false }) }} style={{ backgroundColor: '#f7657b', margin: 15, width: width / 3, padding: 3, borderRadius: 5 }}>
                                            <Text style={{ fontSize: width / 16, textAlign: 'center', color: 'white' }}>Hủy</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { this.updateCart() }} style={{ backgroundColor: '#9fcf5f', margin: 15, width: width / 3, padding: 3, borderRadius: 5 }}>
                                            <Text style={{ fontSize: width / 16, textAlign: 'center', color: 'white' }}>Đồng ý</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </Modal>

                        <TouchableOpacity style={[styles.floatingBtn, shadowOpacity]} onPress={() => { this.checkout() }}>
                            <Icon name='credit-card' size={25} color='white' />
                        </TouchableOpacity>

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
    editForm: { width: width - 20, padding: 10, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
    floatingBtn: { justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 3 * width / 7, bottom: 10, width: width / 7, height: width / 7, borderRadius: width / 14, backgroundColor: '#388E3C' },
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
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#CACACA',
        padding: 5,
        backgroundColor: 'white',
        marginBottom: 5,
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

export default connect(mapStateToProps, { deleteItemInCart, getAllItems, updateItemInCart })(Cart);
