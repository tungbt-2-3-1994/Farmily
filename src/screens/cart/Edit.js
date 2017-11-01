import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    Button, TouchableOpacity, Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

import { updateItemInCart } from '../../actions';


class Edit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: this.props.navigation.state.params.quantity,
        }
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTintColor: 'white',
        headerTitleStyle: { color: 'white', fontFamily: 'Baskerville-BoldItalic', fontSize: 20 },
    }

    updateCart = () => {
        const { itemId } = this.props.navigation.state.params;
        console.log('update', this.state.text);
        if (parseInt(this.state.text) < 0 || isNaN(this.state.text)) {
            Alert.alert('Bạn cần nhập số lượng chính xác');
        } else {
            this.props.updateItemInCart(itemId, parseInt(this.state.text));
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 16, fontFamily: 'Baskerville-BoldItalic' }}>Số lượng hàng hóa bạn muốn mua</Text>
                <TextInput
                    style={{ marginTop: 10, fontSize: 24, borderRadius: 5, borderColor: '#CACACA', borderWidth: 2, width: 100 }}
                    placeholder='Nhập số lượng'
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text + ''}
                    keyboardType='numeric'
                    textAlign='center'
                    underlineColorAndroid='transparent'
                />
                <TouchableOpacity style={styles.accept} onPress={() => this.updateCart()}>
                    <Text style={{ color: 'white', fontSize: 20, fontFamily: 'Baskerville-BoldItalic' }}>Đồng ý</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    accept: {
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginTop: 50,
        borderRadius: 10,
        backgroundColor: '#42F2B0'
    }
};

const mapStateToProps = (state) => {
    // console.log(state.userInfor.user);
    return ({
        loggedIn: state.userInfor.loggedIn,
        user: state.userInfor.user
    });
}

export default connect(mapStateToProps, { updateItemInCart })(Edit);
