import React, { Component } from 'react';
import {
    View,
    Text,
    Image, Alert,
    Button, TouchableOpacity, ScrollView, TextInput, ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import Container from '../../components/Login/Container';
import Label from '../../components/Login/Label';
import ButtonLogin from '../../components/Login/Button';

import { normalSignUp } from '../../actions';

import { Hideo } from 'react-native-textinput-effects';
import { headerStyle } from '../Style';

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textName: '',
            textEmail: '',
            textPassword: '',
            textVerify: '',
            animating: false
        }
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerMode: 'none',
        headerBackTitle: null,
        headerTintColor: 'white',
        headerTitleStyle: headerStyle,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userInfor.loggedIn || nextProps.userInfor.loading) {
            this.setState({ animating: false });
        }
    }

    onSignUp = () => {
        if (this.state.textPassword !== this.state.textVerify) {
            Alert.alert('Mật khẩu xác thực không chính xác');
        } else {
            if (!this.validateEmail(this.state.textEmail)) {
                Alert.alert('Email bạn nhập không hợp lệ');
            } else {
                this.setState({ animating: true });
                this.props.normalSignUp(this.state.textName, this.state.textEmail, this.state.textPassword, this.state.textVerify);
            }
        }
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.scroll}>
                    <Hideo
                        placeholder='Tên người dùng'
                        iconClass={FontAwesomeIcon}
                        iconName={'user'}
                        iconColor={'white'}
                        iconBackgroundColor={'#388E3C'}
                        inputStyle={{ color: '#464949' }}
                        style={{ borderWidth: 1, borderColor: '#388E3C', marginTop: 10 }}
                        onChangeText={(text) => { this.setState({ textName: text }) }}
                        underlineColorAndroid='transparent'
                    />
                    <Hideo
                        placeholder='Email'
                        iconClass={FontAwesomeIcon}
                        iconName={'envelope-o'}
                        iconColor={'white'}
                        iconBackgroundColor={'#388E3C'}
                        inputStyle={{ color: '#464949' }}
                        style={{ borderWidth: 1, borderColor: '#388E3C', marginTop: 10 }}
                        onChangeText={(text) => { this.setState({ textEmail: text }) }}
                        underlineColorAndroid='transparent'
                        keyboardType="email-address"
                    />
                    <Hideo
                        placeholder='Mật khẩu'
                        iconClass={FontAwesomeIcon}
                        iconName={'key'}
                        iconColor={'white'}
                        iconBackgroundColor={'#388E3C'}
                        inputStyle={{ color: '#464949' }}
                        style={{ borderWidth: 1, borderColor: '#388E3C', marginTop: 10 }}
                        secureTextEntry={true}
                        onChangeText={(text) => { this.setState({ textPassword: text }) }}
                        underlineColorAndroid='transparent'
                    />
                    <Hideo
                        placeholder='Xác nhận mật khẩu'
                        iconClass={FontAwesomeIcon}
                        iconName={'key'}
                        iconColor={'white'}
                        iconBackgroundColor={'#388E3C'}
                        inputStyle={{ color: '#464949' }}
                        style={{ borderWidth: 1, borderColor: '#388E3C', marginTop: 10 }}
                        secureTextEntry={true}
                        onChangeText={(text) => { this.setState({ textVerify: text }) }}
                        underlineColorAndroid='transparent'
                    />
                    {/* <Container>
                        <Label text="Email" />
                        <TextInput
                            style={styles.textInput}

                        />
                    </Container>
                    <Container>
                        <Label text="Mật khẩu" />
                        <TextInput
                            secureTextEntry={true}
                            style={styles.textInput}
                            onChangeText={(text) => { this.setState({ textPassword: text }) }}
                            underlineColorAndroid='transparent'
                        />
                    </Container> */}
                    {/* <Container>
                        <Label text="Xác nhận mật khẩu" />
                        <TextInput
                            secureTextEntry={true}
                            style={styles.textInput}
                            onChangeText={(text) => { this.setState({ textVerify: text }) }}
                            underlineColorAndroid='transparent'
                        />
                    </Container> */}
                    <View style={styles.footer}>
                        <Container>
                            <ButtonLogin
                                label="Đăng ký"
                                styles={{ button: styles.primaryButton, label: styles.buttonWhiteText }}
                                onPress={() => { this.onSignUp() }}
                            />
                        </Container>
                    </View>
                    {this.state.animating &&
                        <ActivityIndicator
                            color='red'
                            size="large"
                            style={styles.activityIndicator} />
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    activityIndicator: {
        position: 'absolute', top: 0, left: 0,
        right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'
    },
    signUp: { borderRadius: 5, backgroundColor: '#42F2B0', width: 100, height: 30, justifyContent: 'center', alignItems: 'center' },
    scroll: {
        backgroundColor: 'white',
        padding: 30,
        flexDirection: 'column'
    },
    textInput: {
        height: 30,
        fontSize: 14,
        backgroundColor: '#FFF',
        borderRadius: 5,
        paddingBottom: 2
    },
    buttonWhiteText: {
        fontSize: 16,
        color: '#FFF',
        padding: 8
    },
    primaryButton: {
        backgroundColor: '#34A853',
        borderRadius: 5,
    },
    footer: {
        marginTop: 30,

    },
    icon: {
        width: 26,
        height: 26,
    },
};

const mapStateToProps = (state) => {
    return ({
        userInfor: state.userInfor,
    });
}

export default connect(mapStateToProps, { normalSignUp })(SignUp);
