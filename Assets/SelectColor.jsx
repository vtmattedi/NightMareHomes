import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { TriangleColorPicker, toHsv, fromHsv  } from 'react-native-color-picker'

const ColorModal = ({ startingVal, onOk, title, onClose }) => {
    const [color, setColor] = useState(0);
    const [trigProtect, setTrigProtect] = useState(false);//Protect from changes in the startingVal
    const [fontsLoaded, fontError] = useFonts({
        'FontAwesome': require('./fonts/fa6-free-solid.otf'),
        'Inter': require('./fonts/Inter-variable.ttf'),
    });
    
    //Invert the color maybe null if unexpected input.
    const invert = (Color) => {
        if (typeof Color.h !== 'number' || typeof Color.s !== 'number' || typeof Color.v !== 'number') {
            console.log("not an HSV object", Color);
            return null;
        }
        let color =
        {
            h: (Color.h + 180) % 360,
            s: 1 - Color.s,
            v: 1 - Color.v
        }
        return color;
    };
    useEffect(() => {
        if (!trigProtect) {
            if (typeof startingVal !== 'number') {
                console.log("not a number", startingVal);
                return;
            }
            let color =  startingVal.toString(16);
            while (color.length < 6) {
                color = '0' + color;
            }
            color = '#' + color;
            
            setColor(toHsv(color) );
            setTrigProtect(true);
        }

    }, [color]);


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
                <TouchableOpacity
                    style={[styles.buttons,
                    {
                        backgroundColor: fromHsv(color),
                        borderColor: 'black',
                        borderWidth: 1,
                    }]}
                    onPress={() => {
                        console.log(color);
                        console.log(fromHsv(color));
                        console.log(fromHsv(color).substring(1))
                        console.log(parseInt(fromHsv(color).substring(1),16));
                        onOk(parseInt(fromHsv(color).substring(1),16));
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'FontAwesome',
                            color: fromHsv(invert(color)),
                        }}>{fromHsv(color)}</Text>
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
                flex: 1,
                justifyContent: 'flex-start',
            }}>
                <TriangleColorPicker
                    //oldColor='purple'
                    color={color}
                    onColorChange={(x) => { 
                        setColor(x) }}
                    hideControls={true}
                    hideSliders = {true}
                    style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        top: 0,
                        alignSelf: 'top',
                        marginBottom: '100%',
                        borderWidth: 1,
                
                    }}
                />
            </View>
        </View>
    );
};

export default ColorModal;

const styles = ({
    centeredView: {
     

    },
    numberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
       // margin: 10,
    },
    textInput:
    {
        //display: '',
        position: 'absolute',
        backgroundColor: 'transparent',
        color: 'transparent',
    },
    sideTexts:
    {
        fontFamily: 'FontAwesome',
        fontSize: 40,
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
});