import React, { Component } from 'react';
import {
    View,
    Text,
    Image, ActivityIndicator,
    Button, TouchableOpacity, FlatList, Dimensions, Alert, ScrollView, Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';

import { addItemToCartAll } from '../../actions';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

import { headerStyle } from '../Style';

class CompatibleMenu extends Component {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerTintColor: 'white',
        headerTitleStyle: headerStyle,
    }

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: this.props.userInfor.coords != null ? this.props.userInfor.coords.latitude : 20.9675689,
                longitude: this.props.userInfor.coords != null ? this.props.userInfor.coords.longitude : 105.8337592,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15
            },
            markers: [],
            tempData: [],
            deleteData: [],
            check: false
        }
    }

    componentWillMount() {
        // console.log('props', this.props.navigation.state.params);
        let { data } = this.props.navigation.state.params;
        let { quantityData } = this.props.navigation.state.params;
        this.setState({
            tempData: this.genData(data, quantityData),
            deleteData: this.genDeleteData(this.props.cartId)
        });
    }

    genDeleteData = (src) => {
        // console.log('src', src);
        let res = [];
        if (src.length > 0) {
            for (var i = 0; i < src.length; i++) {
                res.push(src[i].id);
            }
        }
        return res;
    }



    genData = (source, source2) => {
        // console.log('src', source);
        // console.log('src2', source2);
        let result = [];
        for (var i = 0; i < source.length; i++) {
            let temp = {};
            temp.id = source[i];
            temp.quantity = source2[i];
            result.push(temp);
        }
        return result;
    }


    componentDidMount() {
        // console.log('as', this.props.menu);
        this.setState({
            markers: this.props.menu
        });
    }


    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.userInfor);
        if (nextProps.userInfor.coords != null) {
            this.setState({
                region: {
                    latitude: nextProps.userInfor.coords.latitude,
                    longitude: nextProps.userInfor.coords.longitude,
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15
                },
            });
        }
        if (nextProps.nav.routes[0].index == 2 || nextProps.nav.routes[0].index == 3) {
            // console.log('asa');
            this.setState({
                check: false
            });
        }
    }

    renderMakers() {
        markers = [];
        this.state.markers.map((marker) => {
            var latlng = {
                'latitude': marker.latitude,
                'longitude': marker.longitude
            }
            markers.push(
                <MapView.Marker
                    key={marker.latitude}
                    title={marker.name}
                    coordinate={latlng}
                >
                    {Platform.OS === 'ios' &&
                        <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={{ uri: 'http://farm.ongnhuahdpe.com'.concat(marker.logo) }}>

                        </Image>}
                    {Platform.OS === 'android' &&
                        <Image style={{ width: 30, height: 30, resizeMode: 'contain' }}
                            onLoad={() => this.forceUpdate()}
                            onLayout={() => this.forceUpdate()}
                            source={{ uri: 'http://farm.ongnhuahdpe.com'.concat(marker.logo) }}>
                            <Text style={{ width: 0, height: 0 }}>{Math.random()}</Text>
                        </Image>}
                </MapView.Marker>
            );
        })
        return markers;
    }

    chooseStore(id_store) {
        this.setState({
            check: true
        });
        // console.log(this.state.tempData);
        this.props.addItemToCartAll(this.state.deleteData, this.state.tempData, id_store);
        // console.log(id_store);
        // if (this.props.cartId.length == 0) {
        //     this.props.addItemToCartAll(this.state.tempData, id_store);
        // } else {
        //     if (id_store != this.props.cartId[0].vegetable_in_store_id) {
        //         Alert.alert('Bạn chỉ có thể chọn hàng trong cùng một cửa hàng');
        //     } else {
        //         // console.log(this.state.tempData);
        //         this.props.addItemToCartAll(this.state.tempData, id_store);
        //     }
        // }
    }

    renderButton() {
        buttons = [];
        this.state.markers.map((button, i) => {
            buttons.push(
                <TouchableOpacity onPress={this.chooseStore.bind(this, button.id)} key={i} style={{ margin: 5, alignItems: 'center', flexDirection: 'row', backgroundColor: 'lightgray', borderRadius: 10, width: width - 30, height: 50 }}>
                    <Image source={{ uri: 'http://farm.ongnhuahdpe.com'.concat(button.logo) }} style={{ padding: 2, marginLeft: 10, width: 40, height: 40, resizeMode: 'stretch' }} />
                    <Text style={{ paddingLeft: 10 }}>{button.name}</Text>
                </TouchableOpacity>
            );
        })
        return buttons;
    }

    render() {
        var latlng = {
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.6 }}>
                    <MapView style={{ flex: 1 }} initialRegion={this.state.region}>
                        {this.props.userInfor.coords != null &&
                            <MapView.Marker
                                key={this.state.region.latitude}
                                coordinate={latlng}
                                title='Vị trí của bạn'
                            />}
                        {this.renderMakers()}
                    </MapView>
                </View>
                <View style={{ flex: 0.4, backgroundColor: 'white', padding: 5 }}>
                    {this.props.menu.length != 0 ?
                        (
                            <View style={{ flex: 1, paddingTop: 5, alignSelf: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}>Các gợi ý tốt nhất cho bạn:</Text>
                                <ScrollView style={{ marginTop: 5 }}>
                                    {this.renderButton()}
                                </ScrollView>

                            </View>
                        )
                        :
                        (<Text>Bạn cần đăng nhập để xem được thông tin cửa hàng phù hợp</Text>)
                    }
                </View>
                {this.state.check &&
                    <ActivityIndicator
                        color='red'
                        size='large'
                        style={styles.activityIndicator} />
                }
            </View>
        );
    }
}

const styles = {
    activityIndicator: {
        position: 'absolute', top: 0, left: 0,
        right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'
    },
    pin: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const mapStateToProps = (state) => {
    return ({
        userInfor: state.userInfor.userLocation,
        loggedIn: state.userInfor,
        menu: state.menu.compatibleMenu || [],
        cartId: state.cart.goods.data || [],
        nav: state.nav
        // cartId: state.cart.goods.data[0].vegetable_in_store_id || -1
    });
}

export default connect(mapStateToProps, { addItemToCartAll })(CompatibleMenu);
