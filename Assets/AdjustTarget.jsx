import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Keyboard, TouchableOpacity, Text, Button } from 'react-native';
import ShowNumber from './ShowNumber';
import { useFonts } from 'expo-font';

const AdjustNumberModal = ({ startingNum, onOk, title, onClose }) => {
    const [number, setNumber] = useState(0);
    const [index, setIndex] = useState(0);
    const inputRef = useRef(null);
    const [keyboardStatus, setKeyboardStatus] = useState('');
    const [trigProtect, setTrigProtect] = useState(false);
    const [fontsLoaded, fontError] = useFonts({
        'FontAwesome': require('./fonts/fa6-free-solid.otf'),
        'Inter': require('./fonts/Inter-variable.ttf'),
    });

    const safeConvert = (num) => {
        let safe = parseFloat(num);
        console.log(num, safe, isNaN(safe));
        if (isNaN(safe)) {
            safe = 0;
        }
        if (safe < 18) {
            safe = 18;
        } else if (safe > 30) {
            safe = 30;
        }
        return safe;
    };
    const handleInput = ({ nativeEvent: { key: keyValue } }) => {

        const keyNumber = parseInt(keyValue);
        if (!isNaN(keyNumber)) {
            let num = number;
            if (index === 0) {
                num = keyNumber;
            } else if (index === 1) {
                num = num * 10 + keyNumber;
            }
            else if (index === 2) {
                num += keyNumber * 0.1;
            }

            setIndex(index === 2 ? 0 : index + 1);
            setNumber(num);
        }
        else if (keyValue === 'Backspace') {
            var s = number.toString();
            if (s.length > 1) {
                s = s.slice(0, -1);
                if (s === '') {
                    s = '0';
                }
                setNumber(parseFloat(s));
            }
            else
                setNumber(0);
            setIndex(index === 0 ? 0 : index - 1);
        }
        console.log("num: " + number, index);

    }

    const handleStepChange = (step) => {
        if (step === 'up') {
            if (number < 30) {
                setNumber(number + 0.5);
            }
        }
        else if (step === 'down') {
            if (number > 18) {
                setNumber(number - 0.5);
            }
        }
    }


    useEffect(() => {
        if (!trigProtect) {
            setNumber(safeConvert(startingNum));
            setTrigProtect(true);
        }

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setNumber(safeConvert(number));
        });
        return () => {
            hideSubscription.remove();
        };

    }, [number]);


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
                    style={styles.buttons}
                    onPress={() => {
                        onOk(number);
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'FontAwesome',
                        }}>{"Ok"}</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.numberContainer}>
                <TouchableOpacity onPress={() => { handleStepChange('down') }}>
                    <Text style={styles.sideTexts} >{'\u2193'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={
                    () => {
                        try {
                            setNumber(2);
                            inputRef.current.focus();
                        } catch (error) {
                            console.log(error, "Error Focusing. Should not happen");
                        }

                    }

                }>
                    <ShowNumber text={number.toFixed(1)} unit='°C' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { handleStepChange('up') }}>
                    <Text style={styles.sideTexts}>{'\u2191'}</Text>
                </TouchableOpacity>
            </View>
            <TextInput

                ref={inputRef}
                style={styles.textInput}
                //onChangeText={handleInputChange}
                inputMode='decimal'
                cursorColor={'transparent'}
                selectionColor={'transparent'}
                carretHidden={true}
                //keyboardType="numeric"
                //placeholder='Enter Number Here'
                onKeyPress={handleInput}
            //onSubmitEditing={console.log('submit')}

            />
        </View>
    );
};

export default AdjustNumberModal;

const styles = ({
    centeredView: {
        flexdirection: 'column',
        justifyContent: 'center',

    },
    numberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
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

}
)