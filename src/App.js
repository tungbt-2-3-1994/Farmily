import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, NetInfo, Modal, TouchableHighlight } from 'react-native';
import { Provider } from 'react-redux';

import store from './store';
import AppNavigator from './AppNavigator';

export default class Farmily2017 extends Component {

    state = {
        netStatus: false
    }

    // componentDidMount() {
    //     NetInfo.addEventListener('change', (connectionInfo) => {
    //         if (connectionInfo) {
    //             this.setState({ netStatus: true });
    //         } else {
    //             this.setState({ netStatus: false });
    //         }

    //     });
    // }

    render() {
        return (
            <Provider store={store}>
                <AppNavigator />
            </Provider>
        );
    }
}

AppRegistry.registerComponent('Farmily2017', () => Farmily2017);
