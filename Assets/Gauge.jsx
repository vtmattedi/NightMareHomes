import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Circle } from 'react-native-svg';
import { Text } from 'react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';


const Gauge = ({ fill, text, sizeScaler = 1, primaryColor = "#ff0000", secondaryColor = "#ddd", subText, subTextAbove = false }) => {
    if (fill === undefined || fill === null) {
        fill = 0;
        text = "--";
    }
    
    if (fill > 100) {
        fill = 100;
    }
    if (fill < 0) {
        fill = 0;
    }
    if (text === undefined) {
        if (fill === undefined || fill === null) {
            text = "--";
        }
        else {
            if (typeof fill !== "number") {
                fill = parseInt(fill);
            }
            text = fill + "%";
        }

    }

  
    return (
        <View style = {styles.container}>
            {
                subTextAbove && <Text style = {styles.subText}>{subText}</Text>
            }
            <AnimatedCircularProgress
                size={150 * sizeScaler}
                width={15 * sizeScaler}
                fill={fill}
                tintColor={primaryColor}
                backgroundColor={secondaryColor}
                arcSweepAngle={240}
                rotation={240}
                lineCap="round"
                >
                {fill => (
                    <>
                        <Text style={{ fontSize: 32 * sizeScaler}}>{text}</Text>
                    </>
                )}
            </AnimatedCircularProgress>
            {
                !subTextAbove && <Text style = {styles.subText}>{subText}</Text>
            }
        </View>
    );
};

export default Gauge;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '25%',
    },
    highlight: {
        backgroundColor: '#ff00f0',
    },
    subText: {
        fontSize: 20,
        marginTop: -30
    },
});