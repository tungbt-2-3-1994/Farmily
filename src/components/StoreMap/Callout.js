import React, { PropTypes } from 'react';
import {
    Text,
    Image,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const propTypes = {
    marker: PropTypes.object.isRequired,
};

const CalloutItem = ({ marker }) => {
    return (
        <View underlayColor='#dddddd' style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.calloutPhoto} source={{uri: 'http://farm.ongnhuahdpe.com'.concat(marker.logo)}} />
                <Text style={styles.calloutTitle}>{marker.name}</Text>
            </View>
            <View style={{ flexDirection: 'column', width: 200 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Icon name='location-on' />
                    <Text style={styles.calloutDescription}>{marker.address}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Icon name='phone' />
                    <Text style={styles.calloutDescription}>{marker.partner.phone_number}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='alarm-on' />
                        <Text style={styles.calloutDescription}>8:00</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                        <Icon name='alarm-off' />
                        <Text style={styles.calloutDescription}>21:00</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

CalloutItem.propTypes = propTypes;

const styles = {
    calloutPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        margin: 5,
        borderColor: '#CACACA',
        resizeMode: 'contain',
    },
    calloutTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        width: 150,
        color: '#206455',
        fontFamily: 'Baskerville-BoldItalic'
    },
    calloutDescription: {
        fontSize: 12,
        marginLeft: 2
    },
};

{/*<Image style={styles.calloutPhoto} source={marker.photo} />*/ }

export { CalloutItem };