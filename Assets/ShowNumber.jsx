import React from 'react';
import { Text, View } from 'react-native';
import { useAppContext } from './AppContext';

const ShowNumber = ({ text, subtext, unit }) => {
    const Colors = useAppContext().stateVariable;
    const styles = {
        container: {
           // backgroundColor: 'lightblue',
            alignItems: 'center',
            margin: 10,
            padding: 10,
            width: 150,
        },
        text: {
            fontSize: 40,
            fontWeight: 'bold',
            maxWidth: 100,
            color: Colors.text,
            // add your text styles here
        },
        subtext: {
            // add your subtext styles here
            color: Colors.text,
        },
        unit: {
            fontSize: 18,
            position: 'absolute',
            right: 5,
            top: 5,
            marginBottom: 5,
            color: Colors.text,
        },
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}
            </Text>
            <Text style={styles.unit}>{unit}</Text>
            <Text style={styles.subtext}>{subtext}</Text>

        </View>
    );
};

export default ShowNumber; 


