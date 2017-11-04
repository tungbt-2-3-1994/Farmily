import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Button,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert, Dimensions, NetInfo, StatusBar, AppState, BackHandler, Platform
} from 'react-native';

import RNExitApp from 'react-native-exit-app';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import Permissions from 'react-native-permissions';

import { getCheckoutCart, getCurrentLocation, getAllVegetables, getAllStores, goToMain, connectionState } from '../actions';

class Welcome extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            loadingStatus: true
        }
    }

    // update permissions when app comes back from settings
    _handleAppStateChange(appState) {
        if (appState == 'active') {
            this._updatePermissions(this.state.types)
        }
    }

    componentWillMount() {
        this.props.getAllStores();
        this.props.getCurrentLocation();
        this.props.getAllVegetables();

    }

    // _openSettings() {
    //     return Permissions.openSettings()
    //         .then(() => alert('back to app!!'))
    // }

    _requestPermission = () => {
        console.log('request');
        Permissions.request('location')
            .then(response => {
                console.log('res', response);
                this.setState({ locationPermission: response })
                if (response == 'authorized') {
                    this.props.getCurrentLocation();
                } else {
                    (Platform.OS === 'ios') ? RNExitApp.exitApp() : BackHandler.exitApp();
                }
            });
    }
    // _requestCameraPermission = () => {
    //     Permissions.request('camera')
    //         .then(response => {
    //             this.setState({ cameraPermission: response })
    //         });
    // }

    // _alertForLocationPermission = () => {
    //     Alert.alert(
    //         'Yêu cầu quyền truy cập!',
    //         'Ứng dụng cần truy cập vị trí của bạn!',
    //         [
    //             {
    //                 text: 'Không', onPress: () => {
    //                     (Platform.OS === 'ios') ? RNExitApp.exitApp() : BackHandler.exitApp();
    //                 }
    //             },
    //             this.state.locationPermission === 'undetermined' ?
    //                 { text: 'Đồng ý', onPress: this._requestPermission() }
    //                 : { text: 'Mở Settings', onPress: Permissions.canOpenSettings() ? Permissions.openSettings : null }
    //         ]
    //     )
    // }
    // _alertForCameraPermission = () => {
    //     Alert.alert(
    //         'Yêu cầu quyền truy cập!',
    //         'Ứng dụng cần truy cập máy ảnh của bạn!',
    //         [
    //             { text: 'Không', onPress: () => console.log('permission denied') },
    //             this.state.locationPermission === 'undetermined' ?
    //                 { text: 'Đồng ý', onPress: this._requestCameraPermission() }
    //                 : { text: 'Mở cài đặt', onPress: Permissions.canOpenSettings() ? Permissions.openSettings : null }
    //         ]
    //     )
    // }
    _alertForLocationPermission = () => {
        Alert.alert(
            'Yêu cầu quyền truy cập!',
            'Ứng dụng cần truy cập vị trí của bạn!',
            [
                {
                    text: 'Không', onPress: () => {
                        (Platform.OS === 'ios') ? RNExitApp.exitApp() : BackHandler.exitApp();
                    }
                },
                { text: 'Đồng ý', onPress: this._requestPermission() }
            ]
        )
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
        setTimeout(() => {
            if (!this.props.isConnected.isConnected) {
                Alert.alert('Thông báo',
                    'Bạn cần kết nối mạng',
                    [
                        {
                            text: 'OK',
                        },
                    ]
                );
            }
        }, 5000);
        // Permissions.check('location')
        //     .then(response => {
        //         console.log('location', response);
        //         //response is an object mapping type to permission
        //         // this.setState({
        //         //     locationPermission: response,
        //         // });
        //         if (response == 'authorized') {
        //             this.props.getCurrentLocation();
        //         } else {
        //             this._alertForLocationPermission();
        //         }
        //     });
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
        // AppState.removeEventListener('change1', this._handleAppStateChange.bind(this));
    }

    _handleConnectionChange = (isConnected) => {
        console.log('e', isConnected);
        this.props.connectionState(isConnected);
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.isConnected.isConnected) {
            console.log('a');
        }
        this.setState({
            loadingStatus: nextProps.loadingVeget || nextProps.loadingGeo || nextProps.loadingStores
        });
        if (!nextProps.loadingVeget && !nextProps.loadingGeo && !nextProps.loadingStores) {
            console.log('asas');
            this.props.goToMain();
        }
    }



    render() {
        return (
            <View style={[css.container, styles.container]}>
                <StatusBar
                    backgroundColor="rgba(0, 0, 0, 0.6)"
                    barStyle="light-content"
                />
                <Image
                    style={css.auth_bg}
                    source={require('../img/bg.png')}
                    resizeMode="stretch"
                    blurRadius={5}
                />
                <Image
                    style={css.logo}
                    source={require('../img/logo.png')}
                />
                <View style={css.auth_content}>
                    {/* <Text style={{ fontFamily: 'Baskerville-BoldItalic', fontSize: 20, backgroundColor: 'transparent', color: 'white' }}>Chào mừng bạn đến với Farmily</Text> */}
                    <ActivityIndicator
                        animating={this.state.loadingStatus}
                        color='red'
                        size="large"
                        style={{ marginTop: 10 }} />
                </View>
            </View>
        );
    }
}

const styles = {
    inline: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#475299',
        justifyContent: 'center',
        marginTop: 60,
        borderRadius: 5
    },
    container: {
        position: 'relative',
    },
    transparentButton: {
        marginTop: 30,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5
    },
    buttonBlueText: {
        fontSize: 14,
        color: 'white'
    },
    buttonBigText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
};

const css = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    auth_bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    logo: {
        alignSelf: 'center',
        borderRadius: 80,
        height: 160,
        paddingVertical: 40,
        marginTop: 40,
        width: 160,
        marginBottom: 10
    },
    auth_content: {
        paddingHorizontal: 30,
    },
};

const mapStateToProps = (state) => {
    return ({
        loadingGeo: state.userInfor.loading,
        loadingStores: state.store.loading,
        loadingVeget: state.vegetable.loading,
        isConnected: state.network,
    });
}

export default connect(mapStateToProps, { getCheckoutCart, connectionState, goToMain, getCurrentLocation, getAllVegetables, getAllStores })(Welcome);
