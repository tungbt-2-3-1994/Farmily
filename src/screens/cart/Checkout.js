import React, { Component } from 'react';
import { View, WebView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { goBackToMain, cancelCheckout } from '../../actions';

var e;

class Checkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
        e = this;
        this.goBack = this.goBack.bind(this);
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTintColor: 'white',
        headerTitleStyle: { color: 'white', fontFamily: 'Baskerville-BoldItalic', fontSize: 20 },
        headerLeft: (<TouchableOpacity style={{ marginLeft: 5 }} onPress={() => { e.goBack() }}>
            <Icon name='chevron-left' size={20} color='white' />
        </TouchableOpacity>)
    }

    goBack() {
        console.log('âs');
        this.props.cancelCheckout();
    }

    componentWillUnmount() {
        console.log('unmount');
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: 'http://farm.ongnhuahdpe.com/cart/checkout' }}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return ({

    });
}

export default connect(mapStateToProps, { goBackToMain, cancelCheckout })(Checkout);