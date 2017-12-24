import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Dimensions
} from 'react-native';

import { connect } from 'react-redux';

import { goToMain } from '../actions';

import Icon from 'react-native-vector-icons/Ionicons';

import AppIntroSlider from 'react-native-app-intro-slider';

const { width, height } = Dimensions.get('window');

const styles = {
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 2 * width / 3,
        height: 2 * width / 3,
        resizeMode: 'contain'
    }
}

const slides = [
    {
        key: 'somethun',
        title: 'Nhanh',
        text: 'Trồng nhanh\nCung cấp nhanh',
        image: require('../img/logofarmily.png'),
        imageStyle: styles.image,
        backgroundColor: '#22bcb5',
    },
    {
        key: 'somethun-dos',
        title: 'Sạch',
        text: 'Rau sạch.\nĐảm bảo an toàn',
        image: require('../img/logofarmily.png'),
        imageStyle: styles.image,
        backgroundColor: '#2a8cd2',
    },
    {
        key: 'somethun1',
        title: 'Tiện lợi',
        text: 'Mua bán nhanh chóng\nTrải nghiệm tự hái',
        image: require('../img/logofarmily.png'),
        imageStyle: styles.image,
        backgroundColor: '#22bcb5',
    }
];


class AppIntroduce extends Component {

    static navigationOptions = {
        header: null,
    }

    _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="md-arrow-round-forward"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                    style={{ backgroundColor: 'transparent' }}
                />
            </View>
        );
    }
    _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="md-checkmark"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                    style={{ backgroundColor: 'transparent' }}
                />
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor="#388E3C"
                    barStyle="light-content"
                />
                <AppIntroSlider
                    slides={slides}
                    renderDoneButton={this._renderDoneButton}
                    renderNextButton={this._renderNextButton}
                    onDone={() => this.props.goToMain()}
                />
            </View>
        );
    }
}





const mapStateToProps = (state) => {
    return ({
        loggedIn: state.userInfor,
        user: state.userInfor.user
    });
}

export default connect(mapStateToProps, { goToMain })(AppIntroduce);
