import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useFonts } from 'expo-font';

const LinkButton = (props) => {
    const { title, url, style, brand } = props;
    const [brandText, setBrandText] = useState(null);
    const [brandColor, setBrandColor] = useState('white');
    const fontsLoaded = useFonts({
        'FontAwesomeBrands': require('./fonts/fa6-free-brands.otf'),
        'Inter': require('./fonts/Inter-variable.ttf'),
    });

    useEffect(() => {
        if (brand === 'linkedin') {
            setBrandText('\uF08C');
        }
        else if (brand === 'github') {
            setBrandText('\uF092');
        }
        else if (brand === 'web') {
            setBrandText('\uF268');
        }
        else {
            setBrandText('');
        }
    }, [brand]);


    return (
        fontsLoaded &&
        <View style={[style]}>

            <TouchableOpacity onPress={
                () => {
                    if (Linking.canOpenURL(url) === false) {
                        return;
                    }
                    Linking.openURL(url);
                }
            }
            style = 
            {
                {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    width: 125,
                    margin : 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 5, height: 5 },
        
        
                }
            }
            
            >
                <View style={{ marginRight: 5 }}>
                    <Text style={{ fontFamily: 'FontAwesomeBrands', fontSize: 32 }}>{brandText}</Text>
                </View>
                <View >
                    <Text style={styles.title} >{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};


const styles = {
    title: {
        fontFamily : 'Inter',
        fontSize: 16,
    },
    extra: {

    }
}

export default LinkButton;