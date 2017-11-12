import React, { Component } from 'react';
import {
    View, Text, Image, TouchableOpacity, TouchableHighlight, Dimensions, ActivityIndicator,
    FlatList, NetInfo, PanResponder, Modal, Alert, Platform, AppState
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

const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

import Permissions from 'react-native-permissions';

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
                latitude: 20.9675689,
                longitude: 105.8337592,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            initialRender: true,
            markers: [],
            check: false,
            animating: false,
            typing: false,
            searchData: [],
            toogle: false,
            coords: [],
            types: [],
            status: {},
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
        this.props.getCurrentLocation();
        this.setState({
            markers: this.props.stores
        });
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderGrant: this._onPanRespondGrant.bind(this),
        });
    }

    _onPanRespondGrant(event, gestureState) {
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
            if (nextProps.userInfor.coords != null) {
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

        }
    }
    /**
     * _________________________REQUEST LOCATION________________________________________
     */

    _requestPermission = () => {
        Permissions.request('location')
            .then(response => {
                console.log(response);
            });
    }



    _alertForLocationPermission = () => {
        Alert.alert(
            'Yêu cầu quyền truy cập!',
            'Ứng dụng cần truy cập vị trí của bạn!',
            [
                { text: 'Không', onPress: () => console.log('permission denied') },
                this.state.locationPermission == 'undetermined' ?
                    { text: 'Đồng ý', onPress: this._requestPermission() }
                    : { text: 'Mở Settings', onPress: Permissions.canOpenSettings() ? Permissions.openSettings : null }
            ]
        )
    }

    //update permissions when app comes back from settings
    _handleAppStateChange(appState) {
        if (appState == 'active') {
            this.setState({ coords: [] });
            this.props.getCurrentLocation();
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
        AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
    }

    _handleConnectionChange = (isConnected) => {
        // console.log('e', isConnected);
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
        if (this.props.userInfor.coords != null) {
            let startPos = this.props.userInfor.coords.latitude + ',' + this.props.userInfor.coords.longitude;
            let endPos = marker.latitude + ',' + marker.longitude;
            this.getDirections(startPos, endPos);
        }
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

        if (this.props.userInfor.coords != null) {
            let start = this.props.userInfor.coords.latitude + ',' + this.props.userInfor.coords.longitude;
            let end = item.latitude + ',' + item.longitude;
            this.getDirections(start, end);
        }
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
                <MapView
                    ref='map'
                    provider={PROVIDER_GOOGLE}
                    initialRegion={this.state.region}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                    {this.state.coords.length != 0 &&
                        <MapView.Polyline
                            coordinates={this.state.coords}
                            strokeWidth={3}
                            strokeColor="blue" />}
                    {this.props.userInfor.coords != null &&
                        <MapView.Marker
                            key={this.state.region.latitude}
                            coordinate={latlng}
                            title='Vị trí của bạn'
                        />}

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
                        <View style={{ width: width - 20, padding: 10, backgroundColor: 'white', marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ paddingLeft: 10, fontSize: 16, color: 'black' }}>Các cửa hàng xung quanh bạn</Text>
                            <FlatList
                                style={{ margin: 5 }}
                                data={this.props.stores}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => this.clickItem(item)} style={{ alignItems: 'center', padding: 5, borderRadius: 5, borderWidth: 1, borderColor: '#388E3C', flexDirection: 'row', margin: 5 }}>
                                        <Image source={{ uri: 'http://farm.ongnhuahdpe.com'.concat(item.logo) }} style={{ width: 25, height: 25, resizeMode: 'stretch' }} />
                                        <Text style={{ color: 'white', paddingLeft: 5, color: 'black' }}>{item.name}</Text>
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

                <TouchableOpacity style={styles.floatingBtn2} onPress={() => { this._alertForLocationPermission() }}>
                    <Icon name='location-searching' size={25} color='white' />
                </TouchableOpacity>
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
    // console.log('asas', state.network.isConnected);
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

export default connect(mapStateToProps, { getCurrentLocation, connectionState, getNearByStore, untoggleSearch, getAllStores, searchStoreByAddOrInfo, toggleSearch })(AllStore);
