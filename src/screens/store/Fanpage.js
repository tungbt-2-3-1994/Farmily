import React, { Component } from 'react';
import { View, WebView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

import { headerStyle } from '../Style';

class Fanpage extends Component {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTintColor: 'white',
        headerTitleStyle: headerStyle,
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: 'https://www.facebook.com/Farmily-1765714337075387/' }}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                />
            </View>
        );
    }
}

export default Fanpage;