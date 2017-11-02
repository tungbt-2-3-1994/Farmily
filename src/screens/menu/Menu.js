import React, { Component } from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    Button, TouchableOpacity, FlatList, Dimensions, Alert, Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
// import PopupDialog, { SlideAnimation, DialogTitle, DialogButton, } from 'react-native-popup-dialog';

import { getAllVegetables, updateMenu, getCompatibleStore } from '../../actions';

const { width, height } = Dimensions.get('window');

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vegetables: [],
            temp: 0,
            visible: false,
        }
    }

    componentWillMount() {
        // this.props.getAllVegetables();
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
        // if (!nextProps.loading) {
        //     this.setState({
        //         vegetables: nextProps.vegetable
        //     });
        // }
    }

    // getMenu = () => {
    //     let { vegetable } = this.props;
    //     this.props.updateMenu(vegetable);
    // }

    toogleMenuItem = (index) => {
        // console.log('asas');
        let { vegetable } = this.props;
        vegetable.vegetables[index].check = !vegetable.vegetables[index].check;
        this.props.updateMenu(vegetable);
        // this.setState({
        //     vegetables: this.props.vegetable
        // });
    }

    componentWillUnmount() {
        console.log('menu');
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
            // console.log('quantity', quantity);

            let { coords } = this.props.userInfor;

            this.props.getCompatibleStore(coords.latitude, coords.longitude, data, quantity);

        }
    }

    // shouldComponentUpdate() {
    //     console.log('asas');
    //     this.setState({
    //         vegetables: this.props.vegetable
    //     });
    //     return true;
    // }

    showScaleAnimation(index) {


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
                                        this.props.navigation.navigate('EditDir', { 'data': index, 'uri': item.images.length != 0 ? item.images[0] : null });
                                    }}>
                                        {item.images.length !== 0 ?
                                            <Image source={{ uri: item.images[0] }} style={styles.flatItemFood} />
                                            :
                                            <Image source={require('../../img/noImage.jpg')} style={styles.flatItemFood} />
                                        }
                                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
                                            <Text style={{ margin: 2, textAlign: 'center', color: 'white', fontFamily: 'BodoniSvtyTwoOSITCTT-Bold' }}>{item.name}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.toogleMenuItem(index)} style={{ position: 'absolute', right: 10, top: 10 }}>
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
                        </View>
                    )
                    : <View><Text></Text></View>
                }
            </View>


        );
    }
}

const styles = {
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
    });
}

export default connect(mapStateToProps, { getAllVegetables, updateMenu, getCompatibleStore })(Menu);
