import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight } from 'react-native';


export default (props) => {
    let _input = null;
    const { title, onChangeText, placeholder } = props;
    const inputStyle = props.inputStyle || {};
    const containerStyle = props.containerStyle || {};

    return (
        <TouchableHighlight
            onPress={() => _input.focus()}
            underlayColor="transparent"
        >
            <View
                style={{...styles.container, ...containerStyle}}
            >
                {
                    title && <Text style={styles.title}>{title}</Text>
                }
                <TextInput
                    ref={(c) => { _input = c; }}
                    style={{...styles.input, ...inputStyle}}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                />
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
    },
    title: {
        width: 150,
        fontSize: 16,
    },
    input: {},
});
