import React, { PropTypes } from 'react';
import {
    Text,
    Image,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const propTypes = {
    infor: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
};

const Infor = ({ infor, icon }) => {
    return (
        <View style={styles.container}>
            <Icon name={icon} size={20} />
            <Text style={styles.text}>{infor}</Text>
        </View>
    );
};

Infor.propTypes = propTypes;

const styles = {
    container: {
        flexDirection: 'row',
        paddingTop: 10, paddingLeft: 10, paddingRight: 20
    },
    text: {
        paddingLeft: 10,

    }
}


export { Infor };