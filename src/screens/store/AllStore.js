import React, { Component } from 'react';
import {
    View, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions, ActivityIndicator,
    FlatList, NetInfo, PanResponder, Modal, Alert, Platform
} from 'react-native';

import { connect } from 'react-redux';

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Polyline from '@mapbox/polyline';

import debounce from 'lodash.debounce';

import Icon from 'react-native-vector-icons/MaterialIcons';

import SearchBox from '../../components/StoreMap/SearchBox';
import { CalloutItem } from '../../components/StoreMap/Callout';

import { getNearByStore, getCurrentLocation, getAllStores, searchStoreByAddOrInfo, toggleSearch } from '../../actions';
import { untoggleSearch, connectionState } from '../../actions';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

var font = 'baskerville_bold_italic';

// if (Platform.OS == 'android') {
//     font = 'baskerville_bold_italic';
// } else if (Platform.OS == 'ios') {
//     font = 'Baskerville-BoldItalic';
// }

class AllStore extends Component {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTitleStyle: { color: 'white', fontFamily: 'Baskerville-BoldItalic', fontSize: 20 }
    }

    constructor(props) {
        super(props);
        this.state = {
            check_temp: false,
            region: {
                latitude: this.props.userInfor.coords.latitude,
                longitude: this.props.userInfor.coords.longitude,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15
            },
            initialRender: true,
            markers: [],
            check: false,
            animating: false,
            typing: false,
            searchData: [],
            toogle: false,
            coords: []
        }
        this.onChangeTextDelayed = _.debounce(this.onChangeText.bind(this), 1000);
        this.onClearSearching = this.onClearSearching.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.untoggleSearch = this.untoggleSearch.bind(this);
        this._handleConnectionChange = this._handleConnectionChange.bind(this);
    }

    toggleSearch() {
        this.props.toggleSearch();
    }
    untoggleSearch(lat, lng) {
        this.props.untoggleSearch();
        this.moveMapToLocation({
            latitude: lat,
            longitude: lng
        });
    }

    moveMapToLocation(latlng) {
        this.refs.map.animateToRegion({
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
            ...latlng
        }, 2000);
    }

    onChangeText(text) {
        this.setState({
            text: text
        });
        this.props.searchStoreByAddOrInfo(text);
    }

    componentWillMount() {
        this.setState({
            markers: this.props.stores
        });
        // console.log('start to call Api', this.props.isConnected.isConnected);
        // this.props.getCurrentLocation();
        // this.props.getAllStores();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderGrant: this._onPanRespondGrant.bind(this),
        });
    }

    _onPanRespondGrant(event, gestureState) {
        // console.log('locationX', event.nativeEvent.locationX);
        // console.log('pageX', event.nativeEvent.pageX);
        if (event.nativeEvent.locationX === event.nativeEvent.pageX) {
            this.setState({ toogle: false });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            animating: nextProps.loadingStores.loading,
            typing: nextProps.typing,
            searchData: nextProps.searchingData
        });
        if (nextProps.loadingGeo == false) {
            var { coords } = nextProps.userInfor;
            this.setState({
                region: {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
            });
        }
        // if (nextProps.loadingStores.loading == false) {
        //     this.setState({
        //         markers: nextProps.stores
        //     });
        // }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
    }

    _handleConnectionChange = (isConnected) => {
        console.log('e', isConnected);
        this.props.connectionState(isConnected);
    };

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
                    title={marker.title}
                    description={marker.description}
                    coordinate={latlng}
                    onPress={() => this.onMarkerPress(marker)}
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

                    <MapView.Callout onPress={() => this.props.navigation.navigate('StoreDetail', { marker })}>
                        <CalloutItem marker={marker} />
                    </MapView.Callout>
                </MapView.Marker>
            );
        })
        return markers;
    }

    /*  */

    onMarkerPress = (marker) => {
        let startPos = this.props.userInfor.coords.latitude + ',' + this.props.userInfor.coords.longitude;
        let endPos = marker.latitude + ',' + marker.longitude;
        // console.log(startPos, endPos);
        this.getDirections(startPos, endPos);
        this.moveMapToLocation({ 'latitude': marker.latitude, 'longitude': marker.longitude });
    }

    onClearSearching() {
        // console.log('aa');
        this.setState({
            text: ''
        });
    }

    toogleNearby() {
        this.setState({
            toogle: !this.state.toogle
        });
        this.props.getNearByStore(this.state.region.latitude, this.state.region.longitude);
    }

    toogleAll() {
        this.setState({
            toogle: false
        });
        this.props.getAllStores();
    }

    clickItem(item) {
        this.setState({
            toogle: false
        });
        let start = this.props.userInfor.coords.latitude + ',' + this.props.userInfor.coords.longitude;
        let end = item.latitude + ',' + item.longitude;
        this.getDirections(start, end);
        this.moveMapToLocation({ 'latitude': item.latitude, 'longitude': item.longitude });
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
            return error;
        }
    }

    emptyListComponent() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ fontFamily: 'Baskerville-BoldItalic', fontSize: 20 }}>Có lỗi khi tìm các cửa hàng quanh bạn</Text>
            </View>)
    }

    render() {
        // console.log('render', this.state.animating);
        var latlng = {
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude
        }

        return (
            <View style={styles.container}>
                {/* {this.state.animating &&
                    <ActivityIndicator
                        color='red'
                        size="large"
                        style={styles.activityIndicator} />
                } */}
                {/* <Image
                    style={{ width: 0, height: 0 }}
                    source={require('../../img/store.png')}
                /> */}
                <MapView
                    ref='map'
                    provider={PROVIDER_GOOGLE}
                    initialRegion={this.state.region}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                    <MapView.Polyline
                        coordinates={this.state.coords}
                        strokeWidth={3}
                        strokeColor="blue" />
                    <MapView.Marker
                        key={this.state.region.latitude}
                        coordinate={latlng}
                        title='Vị trí của bạn'
                    />
                    {this.renderMakers()}
                </MapView>
                <SearchBox
                    onChangeText={this.onChangeTextDelayed}
                    onCancel={this.onClearSearching}
                    toggleSearch={this.toggleSearch}
                    textValue={this.state.text}
                />
                {this.state.typing && (this.state.searchData.length == 0 ?
                    <View style={styles.flatList}><Text>Khong co du lieu</Text></View>
                    :
                    <FlatList
                        style={styles.flatList}
                        data={this.state.searchData}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.flItem} onPress={() => this.untoggleSearch(item.latitude, item.longitude)}>
                                <Icon name='location-on' size={20} color='#46F2A9' />
                                <Text style={{ flex: 1 }}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                    />
                )}
                <Modal
                    visible={this.state.toogle}
                    transparent={true}
                    onRequestClose={() => this.setState({ toogle: false })}
                >
                    <View
                        {...this.panResponder.panHandlers}
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                        <View style={{ width: width, height: 170 }}>
                            <Text style={{ paddingLeft: 10, fontSize: 16, color: 'rgba(180, 280, 200, 0.7)' }}>Các cửa hàng xung quanh bạn</Text>
                            <FlatList
                                style={{ backgroundColor: 'rgba(131, 199, 92, 0.5)', margin: 5 }}
                                data={this.props.stores}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => this.clickItem(item)} style={{ alignItems: 'center', padding: 5, borderRadius: 5, borderWidth: 1, borderColor: 'blue', flexDirection: 'row', margin: 5 }}>
                                        <Image source={{ uri: 'http://farm.ongnhuahdpe.com'.concat(item.logo) }} style={{ width: 25, height: 25, resizeMode: 'stretch' }} />
                                        <Text style={{ color: 'white', paddingLeft: 5 }}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item.id}
                                ListEmptyComponent={this.emptyListComponent.bind(this)}
                            />
                        </View>
                    </View>
                </Modal>
                {/* {
                    this.state.toogle &&
                    
                } */}
                <TouchableOpacity style={styles.floatingBtn} onPress={() => { this.toogleNearby() }}>
                    <Icon name='zoom-in' size={25} color='white' />
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.floatingBtn2} onPress={() => { this.toogleAll() }}>
                    <Icon name='zoom-out' size={25} color='white' />
                </TouchableOpacity> */}
                {!this.props.isConnected.isConnected &&
                    <View style={styles.activityIndicator}>
                        <Text>Loading</Text>
                    </View>
                }
            </View >
        );
    }
}

const styles = {
    floatingBtn: { justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 10, bottom: 10, width: width / 7, height: width / 7, borderRadius: width / 14, backgroundColor: 'rgba(255, 0, 0, 0.3)' },
    floatingBtn2: { justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 10, bottom: 20 + width / 7, width: width / 7, height: width / 7, borderRadius: width / 14, backgroundColor: 'rgba(255, 0, 0, 0.3)' },
    flItem: { flex: 1, width: width, height: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
    activityIndicator: {
        position: 'absolute', top: 0, left: 0,
        right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'
    },
    container: {
        flex: 1,
    },
    text: {
        color: 'red'
    },
    icon: {
        width: 26,
        height: 26,
    },
    pin: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinText: {
        color: 'red'
    },
    searchBox: {
        position: 'absolute',

    },
    flatList: {
        position: 'absolute',
        top: 50,
        margin: 15,
        backgroundColor: "#fff",
        opacity: 0.9,
    }
};

const mapStateToProps = (state) => {
    console.log('asas', state.network.isConnected);
    return ({
        userInfor: state.userInfor.userLocation,
        loadingGeo: state.userInfor.loading,
        stores: state.store.stores,
        loadingStores: state.store,
        loggedIn: state.userInfor.loggedIn,
        typing: state.searchBox.typing,
        searchingData: state.storeBySearch.stores || [],
        isConnected: state.network
    });
}

export default connect(mapStateToProps, { connectionState, getNearByStore, untoggleSearch, getCurrentLocation, getAllStores, searchStoreByAddOrInfo, toggleSearch })(AllStore);
