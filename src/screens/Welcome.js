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
    Alert, Dimensions, NetInfo, StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

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

    componentWillMount() {
        this.props.getAllStores();
        this.props.getCurrentLocation();
        this.props.getAllVegetables();
        // this.props.getCheckoutCart();
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
                            text: 'Cancel'
                        },
                    ]
                );
            }
        }, 2000);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);
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
                    <Text style={{ fontFamily: 'Baskerville-BoldItalic', fontSize: 20, backgroundColor: 'transparent', color: 'white' }}>Chào mừng bạn đến với Farmily</Text>
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
