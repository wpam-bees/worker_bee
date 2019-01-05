import React, { Component } from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';


export default (props) => {
    const { title, onPress, textStyle } = props;
    const containerStyle = props.containerStyle || {};
    return (
        <TouchableHighlight
            onPress={onPress}
            style={{...styles.container, ...containerStyle}}
        >
            <Text
                style={textStyle}
            >
                {title}
            </Text>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
    },
});
