import React, { Component } from 'react';
import { View, Text, Image, StatusBar, NetInfo, Modal } from 'react-native';

import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

// import RootNav from './navigations/RootNavigator';
import Root from './navigations/Root';
import Service from './Service';

class AppNavigator extends Component {
    state = {
        loaded: false,
        netStatus: true
    }

    constructor() {
        super();
        // Service.load(e => this.setState({ loaded: true }));
    }


    render() {

        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor="#388E3C"
                    barStyle="light-content"
                />
                <Root
                    navigation={addNavigationHelpers({
                        dispatch: this.props.dispatch,
                        state: this.props.nav
                    })}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        nav: state.nav
    };
}

//<View style={styles.header}>
//   {/*<Image source={require('../src/img/icons/homework.png')} style={{width: 40, height: 40, resizeMode: 'cover'}}/>*/}
//    <Text style={styles.title}>Farmily</Text>
//</View>

const styles = {
    header: {
        flex: 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#21610B'
    },
    title: {
        fontFamily: 'BodoniSvtyTwoOSITCTT-Book',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        paddingTop: 5,
        textShadowColor: '#A9F5F2',
        textShadowOffset: { width: 1, height: 1 }
    }
}

export default connect(mapStateToProps)(AppNavigator);