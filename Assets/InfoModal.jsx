import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import ShowNumber from './ShowNumber';
import { useFonts } from 'expo-font';

const InfoModal = ({ title, phrase, onClose }) => {

    const [fontsLoaded, fontError] = useFonts({
        'FontAwesome': require('./fonts/fa6-free-solid.otf'),
        'Inter': require('./fonts/Inter-variable.ttf'),
    });

    return (
        fontsLoaded &&
        <View style={styles.centeredView}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                        onClose();
                    }} >
                    <Text style={{
                        fontFamily: 'FontAwesome',
                    }}>{'\uF177' + " BACK"} </Text>
                </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',

            }}>
                <Text style={styles.phrase}>{phrase}</Text>
            </View>


        </View>
    );
};

export default InfoModal;

const styles = ({
    centeredView: {
        flexdirection: 'column',
        justifyContent: 'center',

    },
    phrase:
    {
        fontSize: 20,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'justify',
    },
    buttons:
    {
        backgroundColor: 'lightblue',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        width: 100,
        alignItems: 'center',
    },
    buttonsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title:
    {
        fontFamily: 'Inter',
        fontSize: 26,

    }

}
)