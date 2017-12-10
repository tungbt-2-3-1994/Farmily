import React, { PropTypes } from 'react';
import {
    Text,
    Image,
    View
} from 'react-native';

const propTypes = {
    infor: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

const InforF = ({ infor, text }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}:</Text>
            <Text style={styles.textF}>{infor}</Text>
        </View>
    );
};

InforF.propTypes = propTypes;

const styles = {
    container: {
        flexDirection: 'row',
        paddingTop: 10, paddingLeft: 10, paddingRight: 20
    },
    text: {
    },
    textF: {
        paddingLeft: 10,
        fontWeight: 'bold',
        fontSize: 16
    },
}


export { InforF };