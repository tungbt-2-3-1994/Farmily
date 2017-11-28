import React, { Component } from 'react';
import {
    Modal,
    View,
    Text,
    Image, PanResponder, StatusBar, TextInput,
    Button, TouchableOpacity, FlatList, Dimensions, Alert, Platform, ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
// import PopupDialog, { SlideAnimation, DialogTitle, DialogButton, } from 'react-native-popup-dialog';

import { getAllVegetables, updateMenu, getCompatibleStore, getCompatibleStoreWithoutLocation } from '../../actions';

const { width, height } = Dimensions.get('window');

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vegetables: [],
            temp: 0,
            visible: false,
            loading: false,
            toog: false,
            name: '',
            quantity: 0,
            index: 0
        }
    }

    componentWillMount() {
        // this.props.getAllVegetables();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderGrant: this._onPanRespondGrant.bind(this),
        });
    }


    componentDidMount() {
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTintColor: 'white',
        headerTitleStyle: { color: 'white', fontFamily: 'Baskerville-BoldItalic', fontSize: 20 },
    }


    componentWillReceiveProps(nextProps) {
        if (!nextProps.loadingMenu) {
            this.setState({ loading: false });
        }
    }

    toogMenuItem = (index) => {
        let { vegetable } = this.props;
        if (vegetable.vegetables[index].check == false) {
            vegetable.vegetables[index].quantity = 1;
        } else {
            vegetable.vegetables[index].quantity = 0;
        }
        vegetable.vegetables[index].check = !vegetable.vegetables[index].check;
        this.props.updateMenu(vegetable);
    }

    componentWillUnmount() {
    }

    getMenu = () => {
        var result = [];
        if (!this.props.loading) {
            for (var i = 0; i < this.props.menu.menu.vegetables.length; i++) {
                if (this.props.menu.menu.vegetables[i].check == true) {
                    result.push(this.props.menu.menu.vegetables[i].id);
                }
            }
        }
        return result;
    }

    //get quantity
    getQuantity = () => {
        var result = [];
        if (!this.props.loading) {
            for (var i = 0; i < this.props.menu.menu.vegetables.length; i++) {
                if (this.props.menu.menu.vegetables[i].check == true) {
                    if (this.props.menu.menu.vegetables[i].quantity == 0) {
                        result.push(this.props.menu.menu.vegetables[i].quantity + 1);
                    } else {
                        result.push(this.props.menu.menu.vegetables[i].quantity);
                    }
                }
            }
        }
        return result;
    }

    checkMenu = () => {
        if (!this.props.loading) {
            for (var i = 0; i < this.props.menu.menu.vegetables.length; i++) {
                if (this.props.menu.menu.vegetables[i].check == true) {
                    return true;
                }
            }
        }
        return false;
    }

    getAvailableStore = () => {
        if (typeof this.props.menu.menu.vegetables == 'undefined' || this.props.menu.menu.vegetables.length == 0 || !this.checkMenu()) {
            Alert.alert('Bạn chưa chọn sản phẩm nào');
        } else {
            let data = this.getMenu();
            let quantity = this.getQuantity();

            this.setState({ loading: true });

            if (this.props.userInfor.coords != null) {
                // console.log('1');
                let { coords } = this.props.userInfor;
                this.props.getCompatibleStore(coords.latitude, coords.longitude, data, quantity);
            } else {
                // console.log('2');
                this.props.getCompatibleStoreWithoutLocation(data, quantity);
            }


        }
    }

    _onPanRespondGrant(event, gestureState) {
        if (event.nativeEvent.locationX === event.nativeEvent.pageX) {
            this.setState({ toog: false });
        }
    }

    onDecrease = () => {
        this.setState({
            quantity: parseInt(this.state.quantity) - 1
        });
    }

    onIncrease = () => {
        this.setState({
            quantity: parseInt(this.state.quantity) + 1
        });
    }

    updateCart = () => {
        if (parseInt(this.state.quantity) <= 0) {
            Alert.alert('Bạn cần điền số lượng lớn hơn 0');
        } else {
            // let { data } = this.props.navigation.state.params;
            this.props.menu.menu.vegetables[this.state.index].quantity = parseInt(this.state.quantity);
            this.props.menu.menu.vegetables[this.state.index].check = true;
            this.props.updateMenu(this.props.menu.menu);
            this.setState({
                toog: false
            });
        }
    }

    render() {
        // console.log('re render')
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#DEDEDE',
            }}>
                {!this.props.loading ?
                    (
                        <View>
                            <FlatList
                                removeClippedSubviews={false}
                                style={{ marginTop: 8, marginLeft: 5, marginRight: 5, marginBottom: 8 }}
                                data={this.props.vegetable.vegetables}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={styles.flatItem} onPress={() => {
                                        let { vegetable } = this.props;
                                        this.props.updateMenu(vegetable);
                                        this.setState({
                                            toog: !this.state.toog,
                                            name: item.name,
                                            quantity: item.quantity,
                                            index: index
                                        });
                                        {/* this.props.navigation.navigate('EditDir', { 'quantity': item.quantity, 'data': index, 'uri': item.images.length != 0 ? item.images[0] : null }); */ }
                                    }}>
                                        {item.images.length !== 0 ?
                                            <Image source={{ uri: item.images[0] }} style={styles.flatItemFood} />
                                            :
                                            <Image source={require('../../img/noImage.jpg')} style={styles.flatItemFood} />
                                        }
                                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(52, 52, 52, 0.8)', paddingVertical: 3 }}>
                                            <Text style={{ textAlign: 'center', color: 'white', fontFamily: 'BodoniSvtyTwoOSITCTT-Bold' }}>
                                                <Text style={{ fontSize: 14 }}>{item.name}</Text>
                                                {item.quantity != 0 && <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#f7657b' }}> x {item.quantity} </Text>}
                                            </Text>

                                        </View>
                                        <TouchableOpacity onPress={() => this.toogMenuItem(index)} style={{ position: 'absolute', right: 10, top: 10 }}>
                                            {item.check == false ?
                                                <Icon name='shopping-cart' size={30} color='rgba(50, 50, 40, 0.4)' style={{ backgroundColor: 'transparent' }} />
                                                :
                                                <Icon name='shopping-cart' size={30} color='red' style={{ backgroundColor: 'transparent' }} />
                                            }
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item.id}
                                horizontal={false}
                                numColumns={2}
                            />
                            <TouchableOpacity style={styles.floatingBtn} onPress={() => {
                                this.getAvailableStore()
                            }}>
                                <Icon name='shopping-cart' size={25} color='white' />
                            </TouchableOpacity>
                            {this.state.loading &&
                                <ActivityIndicator
                                    color='red'
                                    size="large"
                                    style={styles.activityIndicator} />
                            }
                            <Modal
                                visible={this.state.toog}
                                transparent={true}
                                onRequestClose={() => this.setState({ toog: false })}
                            >
                                <View
                                    {...this.panResponder.panHandlers}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                                    <View style={{ width: width - 20, padding: 10, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                        <Text style={{ textAlign: 'center', marginTop: 5 }}>
                                            <Text style={{ fontSize: 16 }}>Số lượng</Text>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#388E3C' }}> {this.state.name} </Text>
                                            <Text style={{ fontSize: 16 }}>muốn mua</Text>
                                        </Text>

                                        <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => this.onDecrease()} style={{ marginRight: 10 }}>
                                                <Text style={{ color: 'red', fontSize: 30 }}>-</Text>
                                            </TouchableOpacity>
                                            <TextInput
                                                style={{ fontSize: 24, borderRadius: 5, borderColor: '#CACACA', borderWidth: 2, width: 100 }}
                                                placeholder='Nhập số lượng'
                                                onChangeText={(quantity) => this.setState({ quantity })}
                                                value={this.state.quantity + ''}
                                                keyboardType='numeric'
                                                textAlign='center'
                                                underlineColorAndroid='transparent'
                                            />
                                            <TouchableOpacity onPress={() => this.onIncrease()} style={{ marginLeft: 10 }}>
                                                <Text style={{ color: '#388E3C', fontSize: 30 }}>+</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => { this.setState({ toog: false }) }} style={{ backgroundColor: '#f7657b', margin: 15, width: width / 3, padding: 3, borderRadius: 5 }}>
                                                <Text style={{ fontSize: width / 16, textAlign: 'center', color: 'white' }}>Hủy</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.updateCart() }} style={{ backgroundColor: '#9fcf5f', margin: 15, width: width / 3, padding: 3, borderRadius: 5 }}>
                                                <Text style={{ fontSize: width / 16, textAlign: 'center', color: 'white' }}>Đồng ý</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* <TouchableOpacity style={styles.accept} onPress={() => this.updateCart()}>
                                                <Text style={{ color: 'white', fontSize: 20, fontFamily: 'Baskerville-BoldItalic' }}>Đồng ý</Text>
                                            </TouchableOpacity> */}

                                    </View>
                                </View>
                            </Modal>
                        </View>
                    )
                    : <View><Text></Text></View>
                }
            </View>


        );
    }
}

const styles = {
    popupContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    activityIndicator: {
        position: 'absolute', top: 0, left: 0,
        right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'
    },
    floatingBtn: { justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 10, bottom: 10, width: width / 7, height: width / 7, borderRadius: width / 14, backgroundColor: 'rgba(255, 0, 0, 0.3)' },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    text: {
        color: 'red',
        fontSize: 20
    },
    flatItem: {
        height: (width - 20) / 2,
        borderRadius: 5,
        borderColor: '#D2D2D2',
        backgroundColor: '#FFFF',
        borderWidth: 2,
        alignItems: 'center',
        flex: 1,
        margin: 4
    },
    flatItemFood: {
        width: (width - 40) / 2,
        height: (width - 40) / 2,
        borderRadius: (width - 40) / 4,
        resizeMode: 'stretch',
    }
};

const mapStateToProps = (state) => {
    // console.log(state.vegetable);
    return ({
        userInfor: state.userInfor.userLocation,
        loadingGeo: state.userInfor.loading,
        vegetable: state.vegetable,
        loading: state.vegetable.loading,
        menu: state.menu || {},
        loadingMenu: state.menu.loading
    });
}

export default connect(mapStateToProps, { getCompatibleStoreWithoutLocation, getAllVegetables, updateMenu, getCompatibleStore })(Menu);
