import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Button, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView,
    Alert,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { connect } from 'react-redux';
// import ViewPager from 'react-native-viewpager';
import ImageSlider from 'react-native-image-slider';

import { addItemToCart, updateItemInCartLocally } from '../../actions';

import { InforF } from '../../components/StoreMap/InforF';

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 9 * window.width / 16;
const STICKY_HEADER_HEIGHT = 50;
const AVATAR_SIZE = 120;

const { width, height } = Dimensions.get('window');

import { headerStyle } from '../Style';

const netural = [
    {
        'pH': '5.5-6.0',
        'cF': '20-25',
        'EC': '2.0-2.5',
        'PPM': '1400-1750'
    },
    {
        //hanh cu
        'pH': '6.0-6.7',
        'cF': '14-18',
        'EC': '1.4-1.8',
        'PPM': '980-1260'
    },
    {
        //xa lach
        'pH': '5.5-6.5',
        'cF': '8-12',
        'EC': '0.8-1.2',
        'PPM': '560-840'
    },
    {
        //cu cai
        'pH': '7.0',
        'cF': '15-20',
        'EC': '1.5-2.0',
        'PPM': '1050-1400'
    },
    {
        //others
        'pH': '6.5-7.0',
        'cF': '14-18',
        'EC': '1.4-1.8',
        'PPM': '980-1260'
    },
    {
        //others
        'pH': '5.8-6.0',
        'cF': '17-25',
        'EC': '1.7-2.5',
        'PPM': '1190-1750'
    },
    {
        'pH': '5.5-6.0',
        'cF': '20-25',
        'EC': '2.0-2.5',
        'PPM': '1400-1750'
    },
    {
        //hanh cu
        'pH': '6.0-6.7',
        'cF': '14-18',
        'EC': '1.4-1.8',
        'PPM': '980-1260'
    },
    {
        //xa lach
        'pH': '5.5-6.5',
        'cF': '8-12',
        'EC': '0.8-1.2',
        'PPM': '560-840'
    },
    {
        'pH': '5.5-6.0',
        'cF': '20-25',
        'EC': '2.0-2.5',
        'PPM': '1400-1750'
    },
    {
        'pH': '5.5-6.0',
        'cF': '20-25',
        'EC': '2.0-2.5',
        'PPM': '1400-1750'
    },
    {
        'pH': '5.5-6.0',
        'cF': '20-25',
        'EC': '2.0-2.5',
        'PPM': '1400-1750'
    },
    {
        'pH': '5.5-6.0',
        'cF': '20-25',
        'EC': '2.0-2.5',
        'PPM': '1400-1750'
    },
];

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
        headerTitleStyle: headerStyle,
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

        const shadowOpacity = {
            shadowOpacity: 0.5,
            shadowOffset: {
                width: -5,
                height: 5
            }
        }
        const vegetableId = this.props.navigation.state.params.item.id;

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
                        <View style={{ backgroundColor: '#FFFFFF', marginTop: 5, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
                            <Text style={styles.text}>Nồng độ dinh dưỡng đang dùng</Text>
                            <InforF infor={netural[vegetableId].cF} text='cF' />
                            <InforF infor={netural[vegetableId].EC} text='EC' />
                            <InforF infor={netural[vegetableId].pH} text='pH' />
                            <InforF infor={netural[vegetableId].PPM} text='PPM' />
                        </View>
                        <View style={{ backgroundColor: '#FFFFFF', marginTop: 5, paddingTop: 5, }}>
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
                                        placeholder='Nhập số lượng'
                                        keyboardType='numeric'
                                        returnKeyType='done'
                                        underlineColorAndroid='transparent'
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
                <TouchableOpacity style={[styles.floatingBtn, shadowOpacity]} onPress={() => { this.addItemToCart() }}>
                    <Icon size={25} color='white' name='add-shopping-cart' />
                </TouchableOpacity>
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
    floatingBtn: { justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 10, bottom: 10, width: width / 7, height: width / 7, borderRadius: width / 14, backgroundColor: '#388E3C' },
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
