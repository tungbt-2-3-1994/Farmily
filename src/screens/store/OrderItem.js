import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Button, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView,
    Alert,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { connect } from 'react-redux';
// import ViewPager from 'react-native-viewpager';
import ImageSlider from 'react-native-image-slider';

import { addItemToCart, updateItemInCartLocally } from '../../actions';

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 9 * window.width / 16;
const STICKY_HEADER_HEIGHT = 50;
const AVATAR_SIZE = 120;

class OrderItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            quantityInput: '',
            images: [],
            position: 0,
            interval: null
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTintColor: 'white',
        headerTitleStyle: { color: 'white', fontFamily: 'Baskerville-BoldItalic', fontSize: 20 },
        headerRight: <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { navigation.navigate('CartStack') }}><Icon size={20} color='white' name='shopping-cart' /></TouchableOpacity>
    });

    renderForeground() {
        let { images } = this.props.navigation.state.params.item;
        return (
            <View style={styles.foreground}>
                <ImageSlider
                    images={this.props.navigation.state.params.item.images}
                    style={{ backgroundColor: 'white' }}
                    position={this.state.position}
                    onPositionChanged={position => this.setState({ position })} />
            </View>
        );
    }

    renderBackground() {
        return (
            <View style={styles.foreground}>
            </View>
        );
    }

    renderStickyHeader() {
        return (
            <View key='sticky-header' style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{this.props.navigation.state.params.item.name}</Text>
            </View>
        );
    }

    componentWillMount() {
        var { images } = this.props.navigation.state.params.item;
        this.setState({
            interval: setInterval(() => {
                this.setState({ position: this.state.position === images.length - 1 ? 0 : this.state.position + 1 });
            }, 5000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    addItemToCart() {
        var vegetableId = this.props.navigation.state.params.item.id;
        var storeId = this.props.storeId;
        // console.log('abc', this.state.quantityInput);

        if (this.props.loggedIn) {
            if (this.props.cart.length != 0) {
                // console.log('storeId', storeId);
                // console.log('storeIdasas', this.props.cart[0].vegetable_in_store.store_id);
                if (storeId != this.props.cart[0].vegetable_in_store.store_id) {
                    Alert.alert('Bạn chỉ có thể thêm hàng của cùng một cửa hàng');
                } else {
                    if (this.state.quantityInput === '') {
                        Alert.alert('Bạn cần nhập số lượng hàng hóa');
                    } else {
                        this.setState({ quantityInput: '' });
                        this.props.addItemToCart(vegetableId, storeId, parseInt(this.state.quantityInput));
                    }
                }
            } else {
                if (this.state.quantityInput === '' || parseInt(this.state.quantityInput) === 0) {
                    Alert.alert('Bạn cần nhập số lượng hàng hóa');
                } else {
                    this.setState({ quantityInput: null });
                    this.props.addItemToCart(vegetableId, storeId, parseInt(this.state.quantityInput));
                }
            }

        } else {
            this.props.navigation.navigate('Account');
            Alert.alert('Bạn cần đăng nhập mới có thể thêm hàng vào giỏ');
        }
    }

    checkout() {
        if (this.props.loggedIn) {
            this.props.navigation.navigate('CartStack');
        } else {
            Alert.alert('Bạn cần đăng nhập mới có thanh toán');
        }
    }

    render() {
        const { onScroll = () => { } } = this.props;
        const { item } = this.props.navigation.state.params;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ParallaxScrollView
                    onScroll={onScroll}
                    stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                    parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                    backgroundSpeed={10}
                    renderBackground={this.renderBackground.bind(this)}
                    renderForeground={this.renderForeground.bind(this)}
                    renderStickyHeader={this.renderStickyHeader.bind(this)}
                >
                    <View style={styles.container}>
                        <View style={{ backgroundColor: '#FFFFFF', marginTop: 5 }}>
                            <Text style={styles.text}>Chi tiết sản phẩm</Text>
                            <Text style={{ fontSize: 16, textAlign: 'left', justifyContent: 'center', padding: 10 }}>{item.description}</Text>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Giá bán: </Text>
                                <Text style={{ fontSize: 16, marginTop: 5 }}>{item.pivot.price} nghìn đồng/kg</Text>
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Số lượng: </Text>
                                <View style={{ paddingTop: 15, flexDirection: 'row' }}>
                                    <TextInput
                                        style={{ fontSize: 16, textAlign: 'right', width: 150 }}
                                        placeholder='Nhap so luong'
                                        keyboardType='numeric'
                                        returnKeyType='done'
                                        onChangeText={(text) => { this.setState({ quantityInput: text }) }}
                                        value={this.state.quantityInput}
                                    />
                                    {Platform.OS === 'android' && <Text style={{ paddingTop: 15, fontSize: 16 }}> kg</Text>}
                                    {Platform.OS === 'ios' && <Text style={{ fontSize: 16 }}> kg</Text>}
                                </View>
                            </View>
                        </View>
                    </View>
                </ParallaxScrollView>
                <View style={styles.add}>
                    <TouchableOpacity onPress={() => { this.addItemToCart() }} style={{ flexDirection: 'row', flex: 0.8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#31A85E', borderRadius: 5 }}>
                        <Icon size={20} color='white' name='add-shopping-cart' />
                        <Text style={{ paddingLeft: 10, fontFamily: 'Baskerville-BoldItalic', color: 'white', fontSize: 20 }}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = {
    add: {
        position: 'absolute',
        width: window.width,
        height: 45,
        bottom: 0,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    textContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, alignItems: 'center' },
    container: {
        flex: 1,
        backgroundColor: '#DEDEDE'
    },
    text: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#7F3355',

    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        width: window.width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FFF",
    },
    stickySectionText: {
        color: '#21610B',
        fontSize: 20,
        margin: 10,
        fontWeight: 'bold',
        fontFamily: 'AvenirNext-HeavyItalic'
    },
    foreground: {
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT,
        justifyContent: 'center',
        backgroundColor: '#FFF',
        alignItems: 'center',
        alignSelf: 'center'
    },
};

const mapStateToProps = (state) => {
    return ({
        loggedIn: state.userInfor.loggedIn,
        user: state.userInfor.user,
        cart: state.cart.goods.data,
        storeId: state.detailStore.storeById.id,

    });
}


export default connect(mapStateToProps, { addItemToCart, updateItemInCartLocally })(OrderItem);
