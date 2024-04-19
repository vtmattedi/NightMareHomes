import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';


const toColor = (num, alpha = 1) => {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}

const ActionCard = ({ title, description, image = require('./images/not-found-nobg.png'), onPress, state, styleId, onLongPress, addtionalData }) => {
    /*
    Handle State
    */
    const [aditionalStyles, setAditionalStyles] = useState({});
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
       // console.log(title, styleId, state)
        var customStyles = {
            card: {},
            title: {},
            description: {},
            image: {},
            cardBody: {}
        };

        if (styleId === 'light-on') {
            customStyles.card.backgroundColor = 'rgba(253, 230, 82, 0.67)';
        }
        else if (styleId === 'light-off') {
            customStyles.card.backgroundColor = 'rgba(118, 118, 118, 0.67)';
        }
        else if (styleId === 'auto-on') {
            customStyles.card.backgroundColor = 'rgba(82, 255, 82, 0.67)';

        }
        else if (styleId === 'auto-off') {
            customStyles.card.backgroundColor = 'rgba(253, 255, 82, 0.67)';
            customStyles.card.borderColor = 'black';
            customStyles.card.borderWidth = 1;

        }
        else if (styleId === 'ac-on') {
            customStyles.card.backgroundColor = 'rgba(20, 255, 253, 0.47)';
            customStyles.description.fontSize = 32;
            customStyles.card.borderColor = 'black';
            customStyles.card.borderWidth = 1;
            customStyles.image.right = 0;

            if (typeof addtionalData === 'boolean') {
                if (addtionalData) {
                    customStyles.card.borderColor = '#CD0000';
                    customStyles.card.borderWidth = 2;
                }
            }

        }
        else if (styleId === 'ac-off') {
            customStyles.card.backgroundColor = customStyles.card.backgroundColor = 'rgba(118, 118, 118, 0.67)';
            customStyles.card.borderColor = 'black';
            customStyles.card.borderWidth = 1;
            customStyles.image.right = 0;

            if (typeof addtionalData === 'boolean') {
                if (addtionalData) {
                    customStyles.card.borderColor = '#CD0000';
                    customStyles.card.borderWidth = 2;
                }
            }
        }
        else if (styleId === 'b-led-on') {
            if (typeof addtionalData === 'number') {
                customStyles.card.backgroundColor = toColor(addtionalData, 0.67);
            }
        }
        else if (styleId === 'sherlock-info') {
            customStyles.card.backgroundColor = 'rgba(255, 255, 255, 0.67)';
            customStyles.card.borderColor = 'black';
            customStyles.card.borderWidth = 2;
            customStyles.cardBody.justifyContent = 'center';
            customStyles.cardBody.alignItems = 'center';
            customStyles.image.display = 'none';
        }
        else if (styleId === 'set-ac-on') {
            customStyles.card.backgroundColor = 'rgba(20, 255, 253, 0.47)';
            customStyles.card.borderColor = 'black';
            customStyles.card.borderWidth = 1;

            customStyles.image.display = 'none';
            customStyles.title.maxWidth = '100%';

            customStyles.cardBody.justifyContent = 'center';
            customStyles.cardBody.alignItems = 'center';

        }
        else if (styleId === 'set-ac-off') {
            customStyles.card.backgroundColor = 'rgba(255, 255, 255, 0.67)';
            customStyles.card.borderColor = 'black';
            customStyles.card.borderWidth = 1;

            customStyles.image.display = 'none';
            customStyles.title.maxWidth = '100%';

            customStyles.cardBody.justifyContent = 'center';
            customStyles.cardBody.alignItems = 'center';

        }
        else if (styleId.includes("sleep")) {
            if (styleId.includes("on")) {
                customStyles.card.backgroundColor = 'rgba(142, 137, 6, 0.67)'
            }
            else {
                customStyles.card.backgroundColor = 'rgba(255, 255, 255, 0.67)'
            }

        }
        else if (styleId.includes("door"))
        {
            if (styleId.includes("open")) {
                customStyles.card.backgroundColor = 'rgba(142, 137, 6, 0.67)'
            }
            else
            {
                customStyles.card.backgroundColor = 'rgba(255, 255, 255, 0.67)'

            }
        }
        else if (styleId.includes("mqtt"))
        {
            customStyles.card.borderWidth = 2;
            if (styleId.includes("on")) {
                customStyles.card.borderColor = 'green'
                customStyles.card.backgroundColor = 'rgba(142, 137, 6, 0.45)'
                customStyles.description.fontSize = 12;
                
            }
            else
            {   customStyles.card.borderColor = 'red'
                customStyles.card.backgroundColor = 'rgba(255, 255, 255, 0.67)'

            }
            customStyles.image.display = 'none';
            customStyles.title.maxWidth = '100%';

            customStyles.cardBody.justifyContent = 'center';
            customStyles.cardBody.alignItems = 'center';
        }

        else     if (styleId === 'offline' || styleId === undefined) {
            // Basically the card is disabled
            customStyles.card.backgroundColor = 'gray';
            customStyles.title.color = 'lightgray';
            customStyles.description.color = 'lightgray';
            customStyles.card.borderColor = 'lightgray';
            customStyles.card.borderWidth = 2;
        }

        if (state === 'offline' || state === undefined) {
            // Basically the card is disabled
            customStyles.card.backgroundColor = 'gray';
            customStyles.title.color = 'lightgray';
            customStyles.description.color = 'lightgray';
            customStyles.card.borderColor = 'lightgray';
            customStyles.card.borderWidth = 2;
            setEnabled(false);
        }
        else {
            setEnabled(true);
        }

        setAditionalStyles(customStyles);

    }, [styleId, addtionalData, state]);

    return (
        <TouchableOpacity style={[styles.card, aditionalStyles.card]}
            onPress={enabled ? onPress : () => { console.log("state is offline onPress disabled") }}
            onLongPress={enabled ? (onLongPress ? onLongPress : () => { console.log("onLongPressNotFound", onLongPress) }) : () => { console.log("state is offline onLongP0ress disabled") }}>
            <Image source={image} style={[styles.image, aditionalStyles.image]} />
            <View style={[styles.cardBody, aditionalStyles.cardBody]}>
                <Text style={[styles.title, aditionalStyles.title]}>{title}</Text>
                <Text style={[styles.description, aditionalStyles.description]}>{enabled ? description : ""}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
//        elevation: 5,
        width: 100,
        height: 100,
        marignTop: 10,
    },
    image: {
        position: 'absolute',
        right: -5,
        width: 50,
        height: 50,
        marginBottom: 8,
        borderRadius: 8,
        // tintColor: 'blue',
    },
    cardBody: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        maxWidth: 50,
        marginBottom: 8,
        left: 0,
    },
    description: {
        fontSize: 16,
    },
};

export default ActionCard;