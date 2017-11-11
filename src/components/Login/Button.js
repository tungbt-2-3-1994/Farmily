import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

const ButtonLogin = (props) => {

    function getContent() {
        if (props.children) {
            return props.children;
        }
        return <Text style={props.styles.label}>{props.label}</Text>
    }

    return (
        <TouchableOpacity
            underlayColor="#ccc"
            onPress={props.onPress}
            style={[
                props.noDefaultStyles ? '' : styles.button,
                props.styles ? props.styles.button : '']}
        >
            {getContent()}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
});

export default ButtonLogin;