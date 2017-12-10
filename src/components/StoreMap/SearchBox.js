import React from "react";
import { Text } from "react-native";
import { View, InputGroup, Input } from "native-base";

import Icon from "react-native-vector-icons/FontAwesome";

import { Dimensions, TouchableOpacity } from 'react-native';
var width = Dimensions.get('window').width;

const SearchBox = ({ onChangeText, onCancel, toggleSearch }) => {
    return (
        <View style={styles.searchBox}>
            <View style={styles.inputWrapper}>
                <InputGroup>
                    <Icon name="search" size={15} color="#FF5E3A" />
                    <Input
                        style={styles.inputSearch}
                        placeholder="Tìm kiếm cửa hàng"
                        onChangeText={onChangeText}
                        onFocus={toggleSearch}
                    />
                    {/*<TouchableOpacity style={{ marginRight: 7 }} >
                        <Icon name="window-close" size={15} color="#FF5E3A" />
                    </TouchableOpacity>*/}
                </InputGroup>
            </View>
        </View>

    );
};
const styles = {
    searchBox: {
        top: 0,
        position: "absolute",
        width: width
    },
    inputWrapper: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 0,
        backgroundColor: "#fff",
        opacity: 0.9,
        borderRadius: 7
    },
    inputSearch: {
        fontSize: 14
    },
};

export default SearchBox;