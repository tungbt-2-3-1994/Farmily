import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList, ActivityIndicator, StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { Infor } from '../../components/StoreMap/Infor';
import { getStoreById } from '../../actions';

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 9 * window.width / 16;
const STICKY_HEADER_HEIGHT = 50;

import { headerStyle } from '../Style';

import ImageSlider from 'react-native-image-slider';
// import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

// import SliderEntry from './../../components/SliderEntry';

// const SLIDER_1_FIRST_ITEM = 1;

import { sliderWidth, itemWidth } from '../../components/styles/SliderEntry.style';
import { colors } from '../../components/styles/index.style';


class StoreDetail extends Component {

    state = {
        uri: '',
        position: 0,
        interval: null,
        check: true,
        // slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        // slider1Ref: null
    }

    // _renderItemWithParallax({ item, index }, parallaxProps) {
    //     return (
    //         <SliderEntry
    //             data={item}
    //             even={(index + 1) % 2 === 0}
    //             parallax={true}
    //             parallaxProps={parallaxProps}
    //         />
    //     );
    // }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#388E3C',
        },
        headerBackTitle: null,
        headerTintColor: 'white',
        headerTitleStyle: headerStyle,
        // headerBackTitleStyle: { color: 'white', fontFamily: 'Baskerville-BoldItalic', fontSize: 16 },
    }


    componentDidMount() {
        const { id } = this.props.navigation.state.params.marker;
        this.props.getStoreById(id);
    }

    renderForeground() {
        if (this.props.loading == false) {
            let { images } = this.props.detailStore;

            var entries = [];

            images.map((image) => {
                // entries.push({ 'illustration': 'http://farm.ongnhuahdpe.com'.concat(image) });
                entries.push('http://farm.ongnhuahdpe.com'.concat(image));
                return entries;
            });
            return (
                <View style={styles.foreground}>
                    <ImageSlider
                        images={entries}
                        style={{ backgroundColor: 'white' }}
                        position={this.state.position}
                        onPositionChanged={position => this.setState({ position })} />
                </View>
            );
        } else {
            return (
                <View style={styles.foreground}>
                    <ActivityIndicator
                        color='red'
                        size="large"
                    />
                </View>
            );
        }
        // return (
        //     <View style={styles.foreground}>
        //         <Carousel
        //             ref={(c) => { if (!this.state.slider1Ref) { this.setState({ slider1Ref: c }); } }}
        //             data={entries}
        //             renderItem={this._renderItemWithParallax}
        //             sliderWidth={sliderWidth}
        //             itemWidth={itemWidth}
        //             hasParallaxImages={true}
        //             firstItem={SLIDER_1_FIRST_ITEM}
        //             inactiveSlideScale={0.9}
        //             inactiveSlideOpacity={0.6}
        //             enableMomentum={false}
        //             containerCustomStyle={styles.slider}
        //             contentContainerCustomStyle={styles.sliderContentContainer}
        //             loop={true}
        //             loopClonesPerSide={2}
        //             autoplay={true}
        //             autoplayDelay={500}
        //             autoplayInterval={3000}
        //         />
        //     </View>
        // );
    }

    componentWillMount() {
        // setTimeout(() => {
        //     let { images } = this.props.detailStore;
        //     // console.log(images);
        //     this.setState({
        //         interval: setInterval(() => {
        //             this.setState({ position: this.state.position === images.length - 1 ? 0 : this.state.position + 1 });
        //         }, 5000)
        //     });
        // }, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loading == false && this.state.check) {
            let { images } = nextProps.detailStore;
            this.setState({
                interval: setInterval(() => {
                    this.setState({ position: this.state.position === images.length - 1 ? 0 : this.state.position + 1 });
                }, 5000),
                check: false
            });
        }
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
                <Text style={styles.stickySectionText}>{this.props.navigation.state.params.marker.name}</Text>
            </View>
        );
    }

    emptyListComponent() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <ActivityIndicator
                    color='red'
                    size="large"
                />
            </View>)
    }

    render() {
        const { onScroll = () => { } } = this.props;
        const { marker } = this.props.navigation.state.params;
        return (
            <View style={{ flex: 1 }}>
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
                        <View style={{ backgroundColor: '#FFFFFF', marginTop: 5, marginBottom: 5, padding: 10 }}>
                            <Text style={styles.text}>Thông tin cửa hàng</Text>
                            <Infor infor={marker.address} icon='location-on' />
                            <Infor infor={marker.info} icon='info-outline' />
                            <Infor infor={marker.partner.phone_number} icon='phone' />
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Fanpage')} style={styles.fanpage}>
                                <Icon name='logo-facebook' size={20} />
                                <Text style={styles.textFanpage}>https://www.facebook.com/Farmily-1765714337075387/</Text>
                            </TouchableOpacity>
                            <Infor infor={'8: 00'} icon='alarm-on' />
                            <Infor infor={'20: 00'} icon='alarm-off' />
                        </View>
                        <View style={{ backgroundColor: '#FFFFFF', marginTop: 5, paddingRight: 3, paddingLeft: 3 }}>
                            <Text style={styles.text}>Các loại sản phẩm</Text>
                            <FlatList
                                style={{ marginTop: 10 }}
                                data={this.props.detailStore.vegetables}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.flatItem} onPress={() => { this.props.navigation.navigate('OrderItem', { item }) }}>
                                        {item.images.length !== 0 ?
                                            <Image source={{ uri: item.images[0] }} style={styles.flatItemFood} />
                                            :
                                            <Image source={require('../../img/noImage.jpg')} style={styles.flatItemFood} />
                                        }
                                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(52, 52, 52, 0.8)' }}>
                                            <Text style={{ margin: 2, textAlign: 'center', color: 'white', fontFamily: 'BodoniSvtyTwoOSITCTT-Bold' }}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item.id}
                                horizontal={false}
                                numColumns={3}
                                ListEmptyComponent={this.emptyListComponent.bind(this)}
                            />
                        </View>
                    </View>
                </ParallaxScrollView>
            </View>
        );
    }
}

const styles = {
    slider: {

    },
    sliderContentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#DEDEDE'
    },
    fanpage: {
        flexDirection: 'row',
        paddingTop: 10, paddingLeft: 12, paddingRight: 20
    },
    textFanpage: {
        paddingLeft: 13,
        color: '#0044CC'
    },
    text: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#7F3355'
    },
    icon: {
        width: 26,
        height: 26,
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
    },
    foreground: {
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT,
        // flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: '#D2D2D2',
    },
    flatItem: {
        height: (window.width - 20) / 3,
        borderRadius: 5,
        borderColor: '#D2D2D2',
        borderWidth: 2,
        alignItems: 'center',
        flex: 1,
        margin: 2
    },
    flatItemFood: {
        width: (window.width - 40) / 3,
        height: (window.width - 40) / 3,
        borderRadius: (window.width - 30) / 6,
        resizeMode: 'contain',
    }
};

const mapStateToProps = (state) => {
    return ({
        loading: state.detailStore.loading,
        detailStore: state.detailStore.storeById,
    });
}

export default connect(mapStateToProps, { getStoreById })(StoreDetail);
