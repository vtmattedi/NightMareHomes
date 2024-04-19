import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';


const TwoColorSquare = ({p,s, resize, selected, onClick}) => {
    useEffect(() => {
       
    }, []);
    return (
        <TouchableOpacity onPress={onClick}>
        <View style={[styles.bigSquare, {borderWidth: selected? 2:1,
        borderColor: selected?'blue':'yellow'}]}>
            <View style={[styles.smallSquare1,{backgroundColor: p}]} />
            <View style={[styles.smallSquare2, {backgroundColor: s}]} />
        </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bigSquare: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 25,
        overflow: 'hidden',
    },
    smallSquare1: {
        width: 70,
        height: 70,
        backgroundColor: 'red',
        transform: [{rotate: '45deg'}],
    },
    smallSquare2: {

        width: 70,
        height: 70,
        position: 'absolute',
        top: 14.5,
        left: 14.5,
        backgroundColor: 'green',
        transform: [{rotate: '45deg'}],
    },
});

export default TwoColorSquare;