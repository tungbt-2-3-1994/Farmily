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
    Alert, Dimensions, NetInfo, StatusBar, AppState, BackHandler, Platform,
    AsyncStorage
} from 'react-native';

import RNExitApp from 'react-native-exit-app';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import Permissions from 'react-native-permissions';

import { NavigationActions } from 'react-navigation';

const { width } = Dimensions.get('window');

import { getCheckoutCart, getCurrentLocation, getAllVegetables, getAllStores, goToMain, connectionState, goToIntroduce } from '../actions';

class Welcome extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            loadingStatus: true,
            status: {},
            types: [],
            skip: false
        }
    }

    // _openSettings() {
    //     return Permissions.openSettings()
    //         .then(() => alert('back to app!!'))
    // }

    // update permissions when app comes back from settings
    // _handleAppStateChange(appState) {
    //     if (appState == 'active') {
    //         this._updatePermissions(this.state.types)
    //     }
    // }

    componentWillMount() {
        this.props.getAllStores();
        this.props.getCurrentLocation();
        this.props.getAllVegetables();
    }

    saveKey = async () => {
        try {
            await AsyncStorage.setItem('InitialKey', '1');
        } catch (error) {
            // Error retrieving data
        }
    }

    getKey = async () => {
        try {
            const value = await AsyncStorage.getItem('InitialKey');
            if (value !== null) {
                this.setState({ skip: true });
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    componentDidMount() {
        this.getKey();
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
    }

    componentWillUnmount() {
        console.log('change');
        NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
        // AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
    }

    _handleConnectionChange = (isConnected) => {
        // console.log('e', isConnected);
        this.props.connectionState(isConnected);
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.isConnected.isConnected) {
            // console.log('a');
        }
        this.setState({
            loadingStatus: nextProps.loadingVeget || nextProps.loadingGeo || nextProps.loadingStores
        });
        if (!nextProps.loadingVeget && !nextProps.loadingGeo && !nextProps.loadingStores) {
            if (this.state.skip === false) {
                this.props.goToIntroduce();
                this.saveKey();
            } else {
                this.props.goToMain();
            }
        }
    }



    render() {
        return (
            <View style={[css.container, styles.container]}>
                <StatusBar
                    backgroundColor="#388E3C"
                    barStyle="light-content"
                />
                <Image
                    style={css.auth_bg}
                    source={require('../img/bg.png')}
                    resizeMode="stretch"
                    blurRadius={5}
                />
                <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
                <Image
                    style={css.logo}
                    source={require('../img/userTransparent.png')}
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
        height: 5 * width / 14,
        width: 5 * width / 14,
        justifyContent: 'center',
        alignItems: 'center'
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

export default connect(mapStateToProps, { goToIntroduce, getCheckoutCart, connectionState, goToMain, getCurrentLocation, getAllVegetables, getAllStores })(Welcome);
