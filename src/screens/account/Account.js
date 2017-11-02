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
    Alert, Dimensions, KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import Container from '../../components/Login/Container';
import Label from '../../components/Login/Label';
import ButtonLogin from '../../components/Login/Button';
const { width, height } = Dimensions.get('window');

import { normalLogin, logout, autoCheckLogin, getAllItems, socialLogin } from '../../actions';

class Account extends Component {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTitleStyle: { color: 'white', fontFamily: 'Baskerville-BoldItalic', fontSize: 20 },
    }

    state = {
        textEmail: '',
        textPassword: '',
        animating: false,
        emailBorderColor: '#595856',
        passBorderColor: '#595856',
    }

    handleEmailFocus = () => {
        this.setState({
            emailBorderColor: '#34A853',
            passBorderColor: '#595856'
        });
    }

    handlePassFocus = () => {
        this.setState({
            passBorderColor: '#34A853',
            emailBorderColor: '#595856'
        });
    }

    onLogin = async () => {
        try {

            const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
            if (result.isCancelled) {
                throw new Error('Please sign in before continue');
            }
            const tokenData = await AccessToken.getCurrentAccessToken();
            const token = tokenData.accessToken.toString();
            // console.log(token);
            this.setState({ animating: true });
            fetch(`https://graph.facebook.com/v2.10/me?fields=email,name,friends,picture&access_token=${token}`)
                .then((response) => response.json())
                .then((json) => {
                    // console.log('json', json);
                    // this.setState({
                    //     url: json.picture.data.url
                    // });

                    this.props.socialLogin(json.name, json.id, json.picture.data.url);
                }).catch(error => {
                    console.log('error', error);
                })
        } catch (error) {

        }
    }

    onNormalLogin(email, password) {
        if (email == '' || password == '') {
            Alert.alert('Bạn cần nhập đủ thông tin các trường');
            this.setState({
                animating: false
            });
        } else {
            if (!this.validateEmail(email)) {
                Alert.alert('Email của bạn không đúng định dạng');
            } else {
                this.setState({
                    animating: true
                });
                this.props.normalLogin(email, password);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loggedIn.loggedIn) {
            this.props.getAllItems();
            this.setState({
                animating: false
            });
        }

        if (!nextProps.loggedIn.loggedIn) {
            this.setState({
                animating: false
            });
        }
    }

    componentWillMount() {
        this.props.autoCheckLogin();
    }

    componentWillUnmount() {
        console.log('account');
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    render() {
        let loginFrom;
        let avatarView;
        if (this.props.loggedIn.loggedIn) {
            if (this.props.user.user.avatar_url != null) {
                avatarView = <Image style={{ width: width / 2, height: width / 2, borderRadius: width / 4, resizeMode: 'contain', marginBottom: 10 }} source={{ uri: this.props.user.user.avatar_url }} />;
            } else {
                avatarView = <Image style={{ width: width / 2, height: width / 2, borderRadius: width / 4, resizeMode: 'contain', marginBottom: 10 }} source={require('../../img/normalAcc.png')} />;
            }
        }

        if (this.props.loggedIn.loggedIn) {
            loginFrom = (
                <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: width, height: width * 3 / 5, backgroundColor: '#00FFFF' }}>
                        {/* <Image style={{ borderColor: '#CACACA', borderWidth: 1, width: width / 2, height: width / 2, borderRadius: width / 4, resizeMode: 'contain', marginBottom: 10 }} source={require('../../img/noImage.jpg')} /> */}
                        {avatarView}
                    </View>
                    <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 5, padding: 10 }}>
                        <Text>
                            <Text>Tên: </Text>
                            <Text style={{ fontFamily: 'Baskerville-BoldItalic', fontSize: 18 }}>
                                {this.props.user.user !== null ? this.props.user.user.name : null}
                            </Text>
                        </Text>
                    </View>
                    <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 5, padding: 10 }}>
                        <Text>
                            <Text>Số điện thoại: </Text>
                            <Text style={{ fontFamily: 'Baskerville-BoldItalic', fontSize: 18 }}>
                                {this.props.user.user !== null ? this.props.user.user.phone_number : 'Không có'}
                            </Text>
                        </Text>

                    </View>
                    <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 5, padding: 10 }}>
                        <Text>
                            <Text>Email: </Text>
                            <Text style={{ fontFamily: 'Baskerville-BoldItalic', fontSize: 18 }}>
                                {this.props.user.user !== null ? this.props.user.user.email : 'Không có'}
                            </Text>
                        </Text>

                    </View>
                    <Container>
                        <ButtonLogin
                            styles={{ button: styles.transparentButtonOut }}
                            onPress={() => {
                                this.setState({ animating: true });
                                this.props.logout()
                            }}
                        >
                            <View style={styles.inline}>
                                <Text style={[styles.buttonBlueText, styles.buttonBigText]}>  Đăng xuất </Text>
                            </View>
                        </ButtonLogin>
                    </Container>
                </ScrollView>
            );
        } else {
            loginFrom = (
                <ScrollView style={styles.scroll}>
                    <Container>
                        <Label text="Email" />
                        <TextInput
                            style={{
                                height: 30,
                                fontSize: 14,
                                backgroundColor: 'white',
                                borderRadius: 5,
                                paddingBottom: 5,
                                borderColor: this.state.emailBorderColor,
                                borderWidth: 2
                            }}
                            returnKeyType="next"
                            onSubmitEditing={() => this.passwordInput.focus()}
                            onChangeText={(text) => { this.setState({ textEmail: text }) }}
                            underlineColorAndroid='transparent'
                            keyboardType="email-address"
                            onFocus={() => this.handleEmailFocus()}
                        />
                    </Container>
                    <Container>
                        <Label text="Mật khẩu" />
                        <TextInput
                            secureTextEntry={true}
                            style={{
                                height: 30,
                                fontSize: 14,
                                backgroundColor: 'white',
                                borderRadius: 5,
                                paddingBottom: 5,
                                borderColor: this.state.passBorderColor,
                                borderWidth: 2
                            }}
                            returnKeyType='go'
                            onChangeText={(text) => { this.setState({ textPassword: text }) }}
                            underlineColorAndroid='transparent'
                            ref={(input) => this.passwordInput = input}
                            onFocus={() => this.handlePassFocus()}
                        />
                    </Container>
                    <View style={styles.footer}>
                        <Container>
                            <ButtonLogin
                                label="Đăng nhập"
                                styles={{ button: styles.primaryButton, label: styles.buttonWhiteText }}
                                onPress={() => { this.onNormalLogin(this.state.textEmail, this.state.textPassword) }}
                            />
                        </Container>
                    </View>
                    <Container>
                        <ButtonLogin
                            styles={{ button: styles.transparentButton }}
                            onPress={() => this.onLogin()}
                        >
                            <View style={styles.inline}>
                                <IconFont name="facebook-official" size={30} color="#3B5699" />
                                <Text style={[styles.buttonBlueText, styles.buttonBigText]}>  Đăng nhập </Text>
                                <Text style={styles.buttonBlueText}>bằng Facebook</Text>
                            </View>
                        </ButtonLogin>
                    </Container>
                    <View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{}}>Bạn chưa có tài khoản?</Text>
                        <TouchableOpacity style={styles.signUp} onPress={() => { this.props.navigation.navigate('SignUpStack') }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        }

        return (
            // <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
            //     {loginFrom}
            // </KeyboardAvoidingView>
            <View style={{ flex: 1 }}>
                {loginFrom}
                {this.state.animating &&
                    <ActivityIndicator
                        color='red'
                        size="large"
                        style={styles.activityIndicator} />
                }
            </View>
        );
    }
}

const styles = {
    activityIndicator: {
        position: 'absolute', top: 0, left: 0,
        right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'
    },
    signUp: { marginTop: 10, borderRadius: 5, backgroundColor: '#009688', width: 100, height: 30, justifyContent: 'center', alignItems: 'center' },
    scroll: {
        backgroundColor: 'white',
        padding: 30,
        flexDirection: 'column'
    },
    textInput: {
        height: 30,
        fontSize: 14,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingBottom: 2,
        borderColor: '#34A853',
        borderWidth: 2
    },
    transparentButton: {
        marginTop: 30,
        borderColor: '#3B5699',
        borderWidth: 2,
        borderRadius: 5,
    },
    transparentButtonOut: {
        marginTop: 30,
        borderColor: '#3B5699',
        borderWidth: 2,
        borderRadius: 5,
        marginLeft: 100, marginRight: 100,
    },
    buttonBlueText: {
        fontSize: 14,
        color: '#3B5699'
    },
    buttonBigText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    inline: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    buttonWhiteText: {
        fontSize: 16,
        color: '#FFF',
        padding: 8,
        fontWeight: 'bold'
    },
    buttonBlackText: {
        fontSize: 20,
        color: '#595856'
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
    // console.log(state.userInfor.user);
    return ({
        loggedIn: state.userInfor,
        user: state.userInfor.user
    });
}

export default connect(mapStateToProps, { socialLogin, getAllItems, normalLogin, logout, autoCheckLogin })(Account);
